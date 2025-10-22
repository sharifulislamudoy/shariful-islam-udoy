import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mail, User, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';

const MessageButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState('form'); // 'form', 'chat'
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [pendingMessageId, setPendingMessageId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    // Generate unique ID for messages
    const generateMessageId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    // Check for existing conversation on component mount AND when modal opens
    useEffect(() => {
        const checkExistingConversation = async () => {
            const existingConversationId = localStorage.getItem('portfolio_conversation_id');
            const existingUserData = localStorage.getItem('portfolio_user_data');
            
            if (existingConversationId && existingUserData) {
                try {
                    const userData = JSON.parse(existingUserData);
                    setFormData(userData);
                    setConversationId(existingConversationId);
                    setCurrentView('chat');
                    
                    // Load existing messages from database
                    await loadConversationMessages(existingConversationId);
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                    // Clear invalid data
                    localStorage.removeItem('portfolio_conversation_id');
                    localStorage.removeItem('portfolio_user_data');
                }
            }
        };

        checkExistingConversation();
    }, []);

    // Also check when modal opens
    useEffect(() => {
        if (isOpen) {
            const existingConversationId = localStorage.getItem('portfolio_conversation_id');
            const existingUserData = localStorage.getItem('portfolio_user_data');
            
            if (existingConversationId && existingUserData && currentView === 'form') {
                try {
                    const userData = JSON.parse(existingUserData);
                    setFormData(userData);
                    setConversationId(existingConversationId);
                    setCurrentView('chat');
                    loadConversationMessages(existingConversationId);
                } catch (error) {
                    console.error('Error loading existing conversation:', error);
                }
            }
        }
    }, [isOpen, currentView]);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket', 'polling']
        });
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        socket.on('message_received', (data) => {
            console.log('📨 Message received:', data);
            
            // Check if this is our own pending message
            if (data.clientMessageId === pendingMessageId) {
                // Update the pending message with the server data
                setMessages(prev => prev.map(msg => 
                    msg.clientMessageId === data.clientMessageId 
                        ? { ...msg, _id: data._id, isPending: false }
                        : msg
                ));
                setPendingMessageId(null);
            } else {
                // This is a new message from the server (admin response)
                // Check if message already exists to prevent duplicates
                setMessages(prev => {
                    const messageExists = prev.some(msg => 
                        msg._id === data._id || msg.clientMessageId === data.clientMessageId
                    );
                    
                    if (!messageExists) {
                        return [...prev, {
                            _id: data._id,
                            text: data.message,
                            isUser: data.sender === 'visitor',
                            timestamp: new Date(data.timestamp),
                            clientMessageId: data.clientMessageId
                        }];
                    }
                    return prev;
                });
            }
        });

        socket.on('conversation_history', (history) => {
            const formattedMessages = history.map(msg => ({
                _id: msg._id,
                text: msg.message,
                isUser: msg.sender === 'visitor',
                timestamp: new Date(msg.timestamp),
                clientMessageId: msg.clientMessageId
            }));
            setMessages(formattedMessages);
            setIsLoadingMessages(false);
        });

        socket.on('conversation_started', (data) => {
            setConversationId(data.conversationId);
            setCurrentView('chat');
        });

        socket.on('admin_typing', (data) => {
            setIsTyping(data.isTyping);
        });

        socket.on('error', (error) => {
            setError(error.message);
            setIsLoadingMessages(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message_received');
            socket.off('conversation_history');
            socket.off('conversation_started');
            socket.off('admin_typing');
            socket.off('error');
        };
    }, [socket, pendingMessageId]);

    // Join conversation when socket and conversationId are available
    useEffect(() => {
        if (socket && conversationId && currentView === 'chat') {
            socket.emit('join_conversation', conversationId);
        }
    }, [socket, conversationId, currentView]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Handle typing indicator
    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);

        if (socket && conversationId) {
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Emit typing start if there's text
            if (value.trim()) {
                socket.emit('typing', {
                    conversationId,
                    isTyping: true
                });
            }

            // Set timeout to stop typing indicator
            const timeout = setTimeout(() => {
                socket.emit('typing', {
                    conversationId,
                    isTyping: false
                });
            }, 1000);

            setTypingTimeout(timeout);
        }
    };

    // Load messages from database
    const loadConversationMessages = async (conversationId) => {
        if (!conversationId) return;
        
        setIsLoadingMessages(true);
        try {
            const response = await fetch(`http://localhost:5000/api/conversations/${conversationId}/messages`);
            
            if (!response.ok) {
                throw new Error('Failed to load messages');
            }
            
            const messagesData = await response.json();
            const formattedMessages = messagesData.map(msg => ({
                _id: msg._id,
                text: msg.message,
                isUser: msg.sender === 'visitor',
                timestamp: new Date(msg.timestamp),
                clientMessageId: msg.clientMessageId
            }));
            
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
            setError('Failed to load conversation history');
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleStartConversation = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/start-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to start conversation');
            }

            // Store conversation ID and user data in localStorage
            localStorage.setItem('portfolio_conversation_id', result.conversationId);
            localStorage.setItem('portfolio_user_data', JSON.stringify(formData));
            
            setConversationId(result.conversationId);
            setCurrentView('chat');
            
            // Load messages for the new conversation
            await loadConversationMessages(result.conversationId);
            
            // Join conversation room
            if (socket) {
                socket.emit('join_conversation', result.conversationId);
            }
            
        } catch (err) {
            setError(err.message);
            console.error('Error starting conversation:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !conversationId) return;

        // Stop typing indicator
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if (socket) {
            socket.emit('typing', {
                conversationId,
                isTyping: false
            });
        }

        const clientMessageId = generateMessageId();
        const messageData = {
            _id: `pending-${clientMessageId}`,
            text: newMessage,
            isUser: true,
            timestamp: new Date(),
            clientMessageId: clientMessageId,
            isPending: true
        };

        // Add message to local state immediately with pending status
        setMessages(prev => [...prev, messageData]);
        setPendingMessageId(clientMessageId);
        
        // Send message via socket
        socket.emit('send_message', {
            conversationId,
            message: newMessage,
            sender: 'visitor',
            clientMessageId: clientMessageId
        });

        setNewMessage('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setError('');
        setSuccess('');
        
        // Stop typing indicator when closing
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if (socket && conversationId) {
            socket.emit('typing', {
                conversationId,
                isTyping: false
            });
        }
    };

    const handleResetConversation = () => {
        // Clear localStorage and reset to form view
        localStorage.removeItem('portfolio_conversation_id');
        localStorage.removeItem('portfolio_user_data');
        setConversationId(null);
        setCurrentView('form');
        setFormData({ name: '', email: '' });
        setMessages([]);
        setNewMessage('');
        setError('');
        setSuccess('');
        setPendingMessageId(null);
        setIsTyping(false);
        
        // Stop typing indicator
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <>
            {/* Floating Message Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/30 border-2 border-white/20"
                whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    y: [0, -10, 0],
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <MessageCircle size={24} />
            </motion.button>

            {/* Message Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={handleClose}
                        >
                            {/* Modal */}
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
                                style={{ maxHeight: '80vh', height: '80vh' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <MessageSquare className="text-blue-400" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {currentView === 'form' ? 'Start Conversation' : 'Live Chat'}
                                            </h3>
                                            {currentView === 'chat' && isTyping && (
                                                <motion.div 
                                                    className="flex items-center gap-1 text-xs text-blue-400"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="flex gap-1">
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                            className="w-1 h-1 bg-blue-400 rounded-full"
                                                        />
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                            className="w-1 h-1 bg-blue-400 rounded-full"
                                                        />
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                            className="w-1 h-1 bg-blue-400 rounded-full"
                                                        />
                                                    </div>
                                                    <span>Admin is typing...</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentView === 'chat' && (
                                            <motion.button
                                                onClick={handleResetConversation}
                                                className="p-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                New Chat
                                            </motion.button>
                                        )}
                                        <motion.button
                                            onClick={handleClose}
                                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <X className="text-gray-400" size={20} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    {currentView === 'form' ? (
                                        /* Start Conversation Form */
                                        <form onSubmit={handleStartConversation} className="p-6 space-y-4 flex-1 overflow-y-auto">
                                            {/* Success Message */}
                                            {success && (
                                                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                                                    <p className="text-green-400 text-sm">{success}</p>
                                                </div>
                                            )}

                                            {/* Error Message */}
                                            {error && (
                                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                                    <p className="text-red-400 text-sm">{error}</p>
                                                </div>
                                            )}

                                            {/* Name Field */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                                    <User size={16} />
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleFormInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                                    <Mail size={16} />
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleFormInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter your email"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        />
                                                        Starting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={18} />
                                                        Start Conversation
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    ) : (
                                        /* Chat Interface */
                                        <div className="flex flex-col h-full">
                                            {/* Messages Container */}
                                            <div 
                                                ref={messagesContainerRef}
                                                className="flex-1 overflow-y-auto p-4 space-y-4"
                                            >
                                                {isLoadingMessages ? (
                                                    <div className="flex justify-center items-center py-8">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                                                        />
                                                        <span className="ml-2 text-gray-400">Loading messages...</span>
                                                    </div>
                                                ) : messages.length === 0 ? (
                                                    <div className="text-center text-gray-400 py-8">
                                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                                        <p>Start the conversation! Send your first message.</p>
                                                    </div>
                                                ) : (
                                                    messages.map((message, index) => (
                                                        <motion.div
                                                            key={message._id || index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                                                    message.isUser
                                                                        ? 'bg-blue-500 text-white rounded-br-none'
                                                                        : 'bg-gray-700 text-white rounded-bl-none'
                                                                } ${message.isPending ? 'opacity-70' : ''}`}
                                                            >
                                                                <p className="text-sm">{message.text}</p>
                                                                <p className={`text-xs mt-1 ${
                                                                    message.isUser ? 'text-blue-100' : 'text-gray-300'
                                                                }`}>
                                                                    {message.timestamp.toLocaleTimeString([], { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit' 
                                                                    })}
                                                                    {message.isPending && ' • Sending...'}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            {/* Message Input - Always visible at bottom */}
                                            <div className="border-t border-gray-800 flex-shrink-0">
                                                <form onSubmit={handleSendMessage} className="p-4">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newMessage}
                                                            onChange={handleInputChange}
                                                            placeholder="Type your message..."
                                                            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        />
                                                        <motion.button
                                                            type="submit"
                                                            disabled={!newMessage.trim()}
                                                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white p-3 rounded-xl transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Send size={18} />
                                                        </motion.button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {currentView === 'form' && (
                                    <div className="px-6 py-4 border-t border-gray-800 flex-shrink-0">
                                        <p className="text-center text-sm text-gray-400">
                                            We'll get back to you as soon as possible
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MessageButton;
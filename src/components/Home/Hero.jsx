import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Database, Palette, Rocket, Send, User, Bot } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const heroRef = useRef(null);

  const roles = [
    "MERN Stack Developer",
    "Next.js Developer",
    "Full Stack Developer",
    "React.js Specialist"
  ];


  // Helper: Convert URLs to clickable links
  const formatMessageWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, idx) => {
      if (part && part.match(urlRegex)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all hover:text-blue-300"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Typing animation for roles
  useEffect(() => {
    const currentRoleText = roles[currentRole];
    if (currentIndex < currentRoleText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentRoleText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentRole]);

  // Initial bot message (only once)
  useEffect(() => {
    if (hasInitialized) return;
    const timer = setTimeout(() => {
      const initialMessage = `Hi! I'm Udoy's AI assistant. I can tell you about his skills, experience, projects, achievements, and more. What would you like to know?`;
      typeMessage(initialMessage, 1, () => {
        setChatMessages([{
          id: 1,
          text: initialMessage,
          isBot: true,
          timestamp: new Date()
        }]);
        setTypingMessage('');
        setHasInitialized(true);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [hasInitialized]);

  // Typing effect helper
  const typeMessage = (message, messageId, callback) => {
    setIsTyping(true);
    setTypingMessage('');
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypingMessage(prev => prev + message.charAt(index));
        index++;
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 20);
  };

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, typingMessage]);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Shariful_Islam_Udoy_Resume.pdf';
    link.click();
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!userInput.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: userInput,
      isBot: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      const data = await response.json();
      const botReply = data.reply || "I'm sorry, I couldn't process your request.";

      const botMessageId = Date.now() + 1;
      typeMessage(botReply, botMessageId, () => {
        setChatMessages(prev => [...prev, {
          id: botMessageId,
          text: botReply,
          isBot: true,
          timestamp: new Date()
        }]);
        setTypingMessage('');
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorReply = "I'm having trouble connecting right now. Please try again later.";
      const errorId = Date.now() + 1;
      typeMessage(errorReply, errorId, () => {
        setChatMessages(prev => [...prev, {
          id: errorId,
          text: errorReply,
          isBot: true,
          timestamp: new Date()
        }]);
        setTypingMessage('');
        setIsLoading(false);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What certificates do you have?",
    "Do you have a recommendation letter?",
    "Are you available for work?",
    "What are your skills?",
    "Tell me about your projects"
  ];

  const handleQuickQuestion = (question) => {
    setUserInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <motion.section
      id="home"
      ref={heroRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20"
    >
      <div className='flex flex-col lg:flex-row justify-between items-center xl:mt-20 w-11/12 mx-auto lg:px-13'>
        {/* Left side: Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 text-left mb-12 lg:mb-0"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Shariful Islam Udoy
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-300 font-mono min-h-[60px]"
          >
            <span className="text-blue-400">{displayText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl"
          >
            Passionate about creating innovative web solutions using modern technologies.
            Specializing in MERN stack and Next.js to build scalable applications.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadResume}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-md rounded-lg cursor-pointer flex items-center gap-3 font-semibold"
          >
            <Download size={20} />
            Download Resume
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex gap-6 mt-8"
          >
            {[Code, Database, Palette, Rocket].map((Icon, index) => (
              <motion.div key={index} whileHover={{ scale: 1.2, rotate: 5 }} className="p-3 bg-gray-800 rounded-lg">
                <Icon className="text-blue-400" size={24} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side: Chatbot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:w-1/2 w-full max-w-2xl"
        >
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700 h-[500px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Bot className="text-green-400" size={20} />
              <div className="text-gray-200 text-sm font-semibold">Udoy's AI Assistant</div>
              <div className="ml-auto text-xs text-gray-400">Online</div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            >
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {message.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.isBot ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                    {/* 🔥 Render message with clickable links (bot only) */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.isBot ? formatMessageWithLinks(message.text) : message.text}
                    </p>
                    <div className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-blue-200'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing animation (plain text, no links yet) */}
              {isTyping && typingMessage && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                      {typingMessage}<span className="animate-pulse">|</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Loading dots */}
              {isLoading && !isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-tl-none p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions */}
            {chatMessages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 border-t border-gray-800">
                <div className="text-xs text-gray-400 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about my skills, experience, projects..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading || isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || isTyping || !userInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
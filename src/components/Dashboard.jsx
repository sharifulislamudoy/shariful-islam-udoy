import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Briefcase,
    FolderOpen,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Plus,
    Edit,
    Trash2,
    Send,
    Mail,
    Calendar,
    MapPin,
    Award,
    Code,
    Database,
    Palette,
    ExternalLink,
    Github,
    RefreshCw,
    Home,
    X
} from 'lucide-react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router';
import CustomCursor from './Custom-Cursor/CustomCursor';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('messages');
    const [stats, setStats] = useState({
        totalMessages: 0,
        unreadMessages: 0,
        totalProjects: 0,
        totalExperience: 0
    });
    const [socket, setSocket] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    // Get admin token from localStorage
    const getAdminToken = () => {
        return localStorage.getItem('adminToken') || 'dev-token-123';
    };

    // Handle logout
    const handleLogout = () => {
        // Remove admin token from localStorage
        localStorage.removeItem('adminToken');
        // Navigate to home page
        navigate('/');
    };

    // Handle back to home
    const handleBackToHome = () => {
        navigate('/');
    };

    // Fetch stats on component mount
    useEffect(() => {
        fetchStats();
        initializeSocket();
    }, []);

    const initializeSocket = () => {
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('✅ Admin connected to server');
        });

        newSocket.on('new_message', (data) => {
            console.log('📨 New message received in admin:', data);
            // Refresh conversations when new message arrives
            setRefreshKey(prev => prev + 1);
            fetchStats(); // Update stats
        });

        newSocket.on('conversation_updated', (data) => {
            console.log('🔄 Conversation updated:', data);
            setRefreshKey(prev => prev + 1);
            fetchStats(); // Update stats
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats', {
                headers: {
                    'admin-token': getAdminToken()
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch stats: ${response.status}`);
            }

            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const tabs = [
        { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'blue' },
        { id: 'projects', name: 'Projects', icon: FolderOpen, color: 'green' },
        { id: 'experience', name: 'Experience', icon: Briefcase, color: 'purple' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <CustomCursor />
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-gray-400">Manage your portfolio website</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBackToHome}
                                className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            >
                                <Home size={16} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Messages"
                        value={stats.totalMessages}
                        icon={MessageSquare}
                        color="blue"
                    />
                    <StatCard
                        title="Unread Messages"
                        value={stats.unreadMessages}
                        icon={Mail}
                        color="red"
                    />
                    <StatCard
                        title="Projects"
                        value={stats.totalProjects}
                        icon={FolderOpen}
                        color="green"
                    />
                    <StatCard
                        title="Experience Items"
                        value={stats.totalExperience}
                        icon={Briefcase}
                        color="purple"
                    />
                </div>

                {/* Main Content */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-700/50">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? `border-${tab.color}-500 text-${tab.color}-400`
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'messages' && <MessagesTab key={refreshKey} socket={socket} getAdminToken={getAdminToken} />}
                        {activeTab === 'projects' && <ProjectsTab getAdminToken={getAdminToken} />}
                        {activeTab === 'experience' && <ExperienceTab getAdminToken={getAdminToken} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 border border-${color}-500/20 rounded-2xl p-6 backdrop-blur-sm`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-white mt-2">{value}</p>
            </div>
            <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
                <Icon className={`text-${color}-400`} size={24} />
            </div>
        </div>
    </motion.div>
);

// Messages Tab Component
const MessagesTab = ({ socket, getAdminToken }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    // Listen for real-time updates
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = () => {
            fetchConversations();
        };

        const handleConversationUpdate = () => {
            fetchConversations();
        };

        socket.on('new_message', handleNewMessage);
        socket.on('conversation_updated', handleConversationUpdate);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('conversation_updated', handleConversationUpdate);
        };
    }, [socket]);

    const fetchConversations = async () => {
        try {
            setLoadingConversations(true);
            setError(null);
            const response = await fetch('http://localhost:5000/api/admin/conversations', {
                headers: {
                    'admin-token': getAdminToken()
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch conversations: ${response.status}`);
            }

            const data = await response.json();
            // Ensure conversations is always an array
            setConversations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setError(error.message);
            setConversations([]); // Set to empty array on error
        } finally {
            setLoadingConversations(false);
        }
    };

    const handleSendReply = async (conversationId) => {
        if (!replyMessage.trim()) return;

        // setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/send-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'admin-token': getAdminToken()
                },
                body: JSON.stringify({
                    conversationId,
                    message: replyMessage
                })
            });

            if (response.ok) {
                setReplyMessage('');
                // Refresh the current conversation to show the new message immediately
                // if (selectedConversation && selectedConversation._id === conversationId) {
                //     await fetchConversation(conversationId);
                // }
                // The socket will also trigger a refresh via the event listeners
            } else {
                console.error('Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConversation = async (conversationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/conversations/${conversationId}`, {
                headers: {
                    'admin-token': getAdminToken()
                }
            });
            const data = await response.json();
            setSelectedConversation(data);

            // Mark messages as read when opening conversation
            await fetch(`http://localhost:5000/api/admin/conversations/${conversationId}/mark-read`, {
                method: 'PUT',
                headers: {
                    'admin-token': getAdminToken()
                }
            });

            // Refresh conversations to update unread counts
            fetchConversations();
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    // Safe array mapping with fallback to empty array
    const conversationsToRender = Array.isArray(conversations) ? conversations : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Conversations</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{conversationsToRender.length} total</span>
                        <button
                            onClick={fetchConversations}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <RefreshCw size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {loadingConversations ? (
                    <div className="flex justify-center items-center py-8">
                        <RefreshCw size={24} className="text-blue-400 animate-spin" />
                        <span className="ml-2 text-gray-400">Loading conversations...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <p className="text-red-400 text-sm mb-2">Error loading conversations</p>
                        <button
                            onClick={fetchConversations}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {conversationsToRender.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No conversations found</p>
                            </div>
                        ) : (
                            conversationsToRender.map((conversation) => (
                                <div
                                    key={conversation._id}
                                    onClick={() => fetchConversation(conversation._id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedConversation?._id === conversation._id
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-700/50 bg-gray-700/20 hover:bg-gray-700/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-white">{conversation.name}</h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(conversation.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">{conversation.email}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-blue-400">
                                            {conversation.messageCount || 0} messages
                                        </span>
                                        {conversation.unreadCount > 0 && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                                {conversation.unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Conversation Details */}
            <div className="lg:col-span-2">
                {selectedConversation ? (
                    <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedConversation.name}</h3>
                                <p className="text-gray-400">{selectedConversation.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">
                                    Started: {new Date(selectedConversation.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Last: {new Date(selectedConversation.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {Array.isArray(selectedConversation.messages) && selectedConversation.messages.length > 0 ? (
                                selectedConversation.messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-md px-4 py-2 rounded-2xl ${message.sender === 'admin'
                                                    ? 'bg-blue-500 text-white rounded-br-none'
                                                    : 'bg-gray-600 text-white rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm">{message.message}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                                    <p>No messages in this conversation</p>
                                </div>
                            )}
                        </div>

                        {/* Reply Form */}
                        <div className="border-t border-gray-700/50 pt-4">
                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-3"
                                rows="3"
                            />
                            <button
                                onClick={() => handleSendReply(selectedConversation._id)}
                                disabled={!replyMessage.trim() || isLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Reply
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-12 text-center">
                        <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Conversation Selected</h3>
                        <p className="text-gray-500">Select a conversation from the list to view messages</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Projects Tab Component
const ProjectsTab = ({ getAdminToken }) => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/admin/projects', {
                headers: {
                    'admin-token': getAdminToken()
                }
            });
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await fetch(`http://localhost:5000/api/admin/projects/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'admin-token': getAdminToken()
                    }
                });
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Manage Projects</h3>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            {showForm && (
                <ProjectForm
                    project={editingProject}
                    onSave={() => {
                        setShowForm(false);
                        setEditingProject(null);
                        fetchProjects();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProject(null);
                    }}
                    getAdminToken={getAdminToken}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <RefreshCw size={24} className="text-blue-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Loading projects...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No projects found</p>
                            <p className="text-sm">Create your first project to get started</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-white text-lg mb-1">{project.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                project.category === 'Full Stack' ? 'bg-blue-500/20 text-blue-400' :
                                                project.category === 'Frontend' ? 'bg-purple-500/20 text-purple-400' :
                                                project.category === 'Backend' ? 'bg-green-500/20 text-green-400' :
                                                'bg-orange-500/20 text-orange-400'
                                            }`}>
                                                {project.category}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                                project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingProject(project);
                                                setShowForm(true);
                                            }}
                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                        >
                                            <Edit className="text-blue-400" size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="text-red-400" size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {Array.isArray(project.technologies) && project.technologies.slice(0, 4).map((tech, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                            {tech}
                                        </span>
                                    ))}
                                    {Array.isArray(project.technologies) && project.technologies.length > 4 && (
                                        <span className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                            +{project.technologies.length - 4} more
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{project.date}</span>
                                    <div className="flex gap-2">
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                                <Github size={16} />
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Technology Input Component
const TechnologyInput = ({ technologies, setTechnologies }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!technologies.includes(inputValue.trim())) {
                setTechnologies([...technologies, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTechnology = (techToRemove) => {
        setTechnologies(technologies.filter(tech => tech !== techToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies *
            </label>
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-800/50 border border-gray-700 rounded-lg min-h-12">
                {technologies.map((tech, index) => (
                    <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm border border-blue-500/30"
                    >
                        {tech}
                        <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 min-w-32"
                    placeholder="Type technology and press Enter..."
                />
            </div>
            <p className="text-xs text-gray-400">Type technology names and press Enter to add them</p>
        </div>
    );
};

// Project Form Component with ALL fields
const ProjectForm = ({ project, onSave, onCancel, getAdminToken }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        detailedDescription: '',
        technologies: [],
        category: 'Frontend',
        date: new Date().getFullYear().toString(),
        githubUrl: '',
        liveUrl: '',
        status: 'Completed',
        features: [],
        challenges: '',
        lessons: '',
        screenshots: []
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                detailedDescription: project.detailedDescription || '',
                technologies: Array.isArray(project.technologies) ? project.technologies : [],
                category: project.category || 'Frontend',
                date: project.date || new Date().getFullYear().toString(),
                githubUrl: project.githubUrl || '',
                liveUrl: project.liveUrl || '',
                status: project.status || 'Completed',
                features: Array.isArray(project.features) ? project.features : [],
                challenges: project.challenges || '',
                lessons: project.lessons || '',
                screenshots: Array.isArray(project.screenshots) ? project.screenshots : []
            });
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = project
                ? `http://localhost:5000/api/admin/projects/${project._id}`
                : 'http://localhost:5000/api/admin/projects';

            const method = project ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'admin-token': getAdminToken()
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSave();
            } else {
                console.error('Failed to save project');
            }
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleImageUpload = async (file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'react_unsigned');

            const response = await fetch('https://api.cloudinary.com/v1_1/dohhfubsa/image/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, '']
        });
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const addScreenshot = async (file) => {
        try {
            const imageUrl = await handleImageUpload(file);
            setFormData({
                ...formData,
                screenshots: [...formData.screenshots, imageUrl]
            });
        } catch (error) {
            console.error('Failed to upload screenshot:', error);
            alert('Failed to upload screenshot. Please try again.');
        }
    };

    const removeScreenshot = (index) => {
        const newScreenshots = formData.screenshots.filter((_, i) => i !== index);
        setFormData({ ...formData, screenshots: newScreenshots });
    };

    return (
        <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
                {project ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Full Stack">Full Stack</option>
                            <option value="Mobile">Mobile</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                        <input
                            type="text"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2024"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Planning">Planning</option>
                        </select>
                    </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/username/project"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Live Demo URL</label>
                        <input
                            type="url"
                            value={formData.liveUrl}
                            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://project-demo.vercel.app"
                        />
                    </div>
                </div>

                {/* Descriptions */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description that appears in project cards..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description</label>
                    <textarea
                        value={formData.detailedDescription}
                        onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Comprehensive description for project details page..."
                    />
                </div>

                {/* Technologies */}
                <TechnologyInput 
                    technologies={formData.technologies}
                    setTechnologies={(techs) => setFormData({ ...formData, technologies: techs })}
                />

                {/* Features */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">Features</label>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm transition-colors"
                        >
                            <Plus size={14} />
                            Add Feature
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    placeholder={`Feature ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {formData.features.length === 0 && (
                            <p className="text-gray-400 text-sm italic">No features added yet</p>
                        )}
                    </div>
                </div>

                {/* Challenges & Lessons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Challenges</label>
                        <textarea
                            value={formData.challenges}
                            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the challenges faced during development..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Lessons Learned</label>
                        <textarea
                            value={formData.lessons}
                            onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What you learned from this project..."
                        />
                    </div>
                </div>

                {/* Screenshots */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">Screenshots</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        addScreenshot(file);
                                    }
                                    e.target.value = ''; // Reset input
                                }}
                                className="hidden"
                                id="screenshot-upload"
                            />
                            <label
                                htmlFor="screenshot-upload"
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors cursor-pointer"
                            >
                                {uploading ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <Plus size={14} />
                                )}
                                Upload Screenshot
                            </label>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {formData.screenshots.map((screenshot, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                <img 
                                    src={screenshot} 
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-16 h-12 object-cover rounded border border-gray-600"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={screenshot}
                                        readOnly
                                        className="w-full px-3 py-1 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeScreenshot(index)}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {formData.screenshots.length === 0 && (
                            <p className="text-gray-400 text-sm italic">No screenshots added yet</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-700/50">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        {project ? 'Update' : 'Create'} Project
                    </button>
                </div>
            </form>
        </div>
    );
};

// Experience Tab Component
const ExperienceTab = ({ getAdminToken }) => {
    const [experiences, setExperiences] = useState([]);
    const [editingExperience, setEditingExperience] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/admin/experiences', {
                headers: {
                    'admin-token': getAdminToken()
                }
            });
            const data = await response.json();
            setExperiences(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (experienceId) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await fetch(`http://localhost:5000/api/admin/experiences/${experienceId}`, {
                    method: 'DELETE',
                    headers: {
                        'admin-token': getAdminToken()
                    }
                });
                fetchExperiences();
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Manage Experience</h3>
                <button
                    onClick={() => {
                        setEditingExperience(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Add Experience
                </button>
            </div>

            {showForm && (
                <ExperienceForm
                    experience={editingExperience}
                    onSave={() => {
                        setShowForm(false);
                        setEditingExperience(null);
                        fetchExperiences();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingExperience(null);
                    }}
                    getAdminToken={getAdminToken}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <RefreshCw size={24} className="text-blue-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Loading experiences...</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No experience entries found</p>
                            <p className="text-sm">Add your first experience to get started</p>
                        </div>
                    ) : (
                        experiences.map((experience) => (
                            <div key={experience._id} className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg">
                                            <Briefcase className="text-blue-400" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white text-lg">{experience.title}</h4>
                                            <p className="text-cyan-400">{experience.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingExperience(experience);
                                                setShowForm(true);
                                            }}
                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                        >
                                            <Edit className="text-blue-400" size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(experience._id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="text-red-400" size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Calendar className="text-blue-400" size={16} />
                                        <span>{experience.period}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin className="text-cyan-400" size={16} />
                                        <span>{experience.location}</span>
                                    </div>
                                </div>

                                <p className="text-gray-300 mb-4">{experience.description}</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {Array.isArray(experience.technologies) && experience.technologies.map((tech, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs border border-blue-500/20">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    {Array.isArray(experience.achievements) && experience.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Award className="text-green-400" size={14} />
                                            <span className="text-green-300 text-sm">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Experience Form Component
const ExperienceForm = ({ experience, onSave, onCancel, getAdminToken }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        period: '',
        location: '',
        type: 'Full-time',
        description: '',
        technologies: [],
        achievements: []
    });

    useEffect(() => {
        if (experience) {
            setFormData({
                title: experience.title || '',
                company: experience.company || '',
                period: experience.period || '',
                location: experience.location || '',
                type: experience.type || 'Full-time',
                description: experience.description || '',
                technologies: Array.isArray(experience.technologies) ? experience.technologies : [],
                achievements: Array.isArray(experience.achievements) ? experience.achievements : []
            });
        }
    }, [experience]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = experience
                ? `http://localhost:5000/api/admin/experiences/${experience._id}`
                : 'http://localhost:5000/api/admin/experiences';

            const method = experience ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'admin-token': getAdminToken()
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSave();
            }
        } catch (error) {
            console.error('Error saving experience:', error);
        }
    };

    return (
        <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
                {experience ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Period</label>
                        <input
                            type="text"
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2022 - 2023"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Technologies (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.technologies.join(', ')}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech) })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Achievements (one per line)
                    </label>
                    <textarea
                        value={formData.achievements.join('\n')}
                        onChange={(e) => setFormData({ ...formData, achievements: e.target.value.split('\n').filter(achievement => achievement.trim()) })}
                        rows="4"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Improved performance by 40%&#10;Led 5+ successful projects"
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        {experience ? 'Update' : 'Create'} Experience
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminDashboard;
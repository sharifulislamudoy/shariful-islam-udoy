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
    RefreshCw
} from 'lucide-react';
import io from 'socket.io-client';

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

    // Get admin token from localStorage
    const getAdminToken = () => {
        return localStorage.getItem('adminToken') || 'dev-token-123';
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
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-gray-400">Manage your portfolio website</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={fetchStats}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                                <LogOut size={18} />
                                Logout
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
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
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

        setIsLoading(true);
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
                // The socket will trigger a refresh via the event listeners
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

    // Auto-refresh conversations every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

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
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedConversation?._id === conversation._id
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
                                            className={`max-w-md px-4 py-2 rounded-2xl ${
                                                message.sender === 'admin'
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
                                    <h4 className="font-semibold text-white text-lg">{project.title}</h4>
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
                                    {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                            {tech}
                                        </span>
                                    ))}
                                    {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                            +{project.technologies.length - 3} more
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{project.category}</span>
                                    <span>{project.date}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Project Form Component
const ProjectForm = ({ project, onSave, onCancel, getAdminToken }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: [],
        category: 'Frontend',
        date: new Date().getFullYear().toString(),
        githubUrl: '',
        liveUrl: '',
        status: 'Completed'
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                technologies: Array.isArray(project.technologies) ? project.technologies : [],
                category: project.category || 'Frontend',
                date: project.date || new Date().getFullYear().toString(),
                githubUrl: project.githubUrl || '',
                liveUrl: project.liveUrl || '',
                status: project.status || 'Completed'
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
            }
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    return (
        <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
                {project ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Full Stack">Full Stack</option>
                            <option value="Mobile">Mobile</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)})}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                        <input
                            type="text"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2024"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
                        <input
                            type="url"
                            value={formData.liveUrl}
                            onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, period: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)})}
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
                        onChange={(e) => setFormData({...formData, achievements: e.target.value.split('\n').filter(achievement => achievement.trim())})}
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
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
    Github
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('messages');
    const [stats, setStats] = useState({
        totalMessages: 0,
        unreadMessages: 0,
        totalProjects: 0,
        totalExperience: 0
    });

    // Fetch stats on component mount
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats');
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
        { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'orange' }
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                            <LogOut size={18} />
                            Logout
                        </button>
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
                        {activeTab === 'messages' && <MessagesTab />}
                        {activeTab === 'projects' && <ProjectsTab />}
                        {activeTab === 'experience' && <ExperienceTab />}
                        {activeTab === 'analytics' && <AnalyticsTab />}
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
const MessagesTab = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/conversations');
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const handleSendReply = async (conversationId) => {
        if (!replyMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/api/admin/send-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId,
                    message: replyMessage
                })
            });

            if (response.ok) {
                setReplyMessage('');
                fetchConversations();
                // Refresh selected conversation
                if (selectedConversation?._id === conversationId) {
                    fetchConversation(conversationId);
                }
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    const fetchConversation = async (conversationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/conversations/${conversationId}`);
            const data = await response.json();
            setSelectedConversation(data);
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Conversations</h3>
                    <span className="text-gray-400 text-sm">{conversations.length} total</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {conversations.map((conversation) => (
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
                                    {conversation.messageCount} messages
                                </span>
                                {conversation.unreadCount > 0 && (
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        {conversation.unreadCount} new
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
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
                            {selectedConversation.messages?.map((message) => (
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
                            ))}
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
                                disabled={!replyMessage.trim()}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                            >
                                <Send size={18} />
                                Send Reply
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
const ProjectsTab = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await fetch(`http://localhost:5000/api/admin/projects/${projectId}`, {
                    method: 'DELETE'
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
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
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
                            {project.technologies.slice(0, 3).map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                    {tech}
                                </span>
                            ))}
                            {project.technologies.length > 3 && (
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
                ))}
            </div>
        </div>
    );
};

// Project Form Component
const ProjectForm = ({ project, onSave, onCancel }) => {
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
            setFormData(project);
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
                        onChange={(e) => setFormData({...formData, technologies: e.target.value.split(', ')})}
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
const ExperienceTab = () => {
    const [experiences, setExperiences] = useState([]);
    const [editingExperience, setEditingExperience] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/experiences');
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    const handleDelete = async (experienceId) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await fetch(`http://localhost:5000/api/admin/experiences/${experienceId}`, {
                    method: 'DELETE'
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
                />
            )}

            <div className="space-y-4">
                {experiences.map((experience) => (
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
                            {experience.technologies.map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs border border-blue-500/20">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {experience.achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Award className="text-green-400" size={14} />
                                    <span className="text-green-300 text-sm">{achievement}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Experience Form Component
const ExperienceForm = ({ experience, onSave, onCancel }) => {
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
            setFormData(experience);
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
                        onChange={(e) => setFormData({...formData, technologies: e.target.value.split(', ')})}
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
                        onChange={(e) => setFormData({...formData, achievements: e.target.value.split('\n')})}
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

// Analytics Tab Component
const AnalyticsTab = () => {
    const [analytics, setAnalytics] = useState({
        totalVisitors: 0,
        messagesPerDay: 0,
        popularProjects: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/analytics');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Website Statistics</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Visitors</span>
                        <span className="text-white font-semibold">{analytics.totalVisitors}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Messages Per Day</span>
                        <span className="text-white font-semibold">{analytics.messagesPerDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Conversations</span>
                        <span className="text-white font-semibold">{analytics.activeConversations || 0}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Projects</h3>
                <div className="space-y-3">
                    {analytics.popularProjects?.map((project, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-400">{project.title}</span>
                            <span className="text-white font-semibold">{project.views} views</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
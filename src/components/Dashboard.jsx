import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FolderOpen, Plus, Edit, Trash2, Home, LogOut, X, RefreshCw, Github, ExternalLink, Calendar, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router';
import CustomCursor from './Custom-Cursor/CustomCursor';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [stats, setStats] = useState({ totalProjects: 0, totalExperience: 0 });
    const navigate = useNavigate();

    // ✅ Returns the raw ADMIN_SECRET — what the server actually checks
    const getAdminToken = () => localStorage.getItem('adminToken') || import.meta.env.VITE_ADMIN_SECRET;

    // ✅ Guard: redirect to login if token is missing or expired
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const expiry = localStorage.getItem('adminTokenExpiry');
        if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExpiry');
            navigate('/admin');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        navigate('/');
    };

    const handleBackToHome = () => navigate('/');

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, {
                headers: { 'admin-token': getAdminToken() }
            });
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const tabs = [
        { id: 'projects', name: 'Projects', icon: FolderOpen, color: 'green' },
        { id: 'experience', name: 'Experience', icon: Briefcase, color: 'purple' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <CustomCursor />
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="w-11/12 mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-gray-400">Manage your portfolio</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleBackToHome} className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                                <Home size={16} />
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="w-11/12 mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard title="Projects" value={stats.totalProjects} icon={FolderOpen} color="green" />
                    <StatCard title="Experience Items" value={stats.totalExperience} icon={Briefcase} color="purple" />
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                    <div className="border-b border-gray-700/50">
                        <nav className="flex space-x-8 px-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? `border-${tab.color}-500 text-${tab.color}-400`
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                    }`}>
                                    <tab.icon size={18} />{tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-6">
                        {activeTab === 'projects' && <ProjectsTab getAdminToken={getAdminToken} />}
                        {activeTab === 'experience' && <ExperienceTab getAdminToken={getAdminToken} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 border border-${color}-500/20 rounded-2xl p-6 backdrop-blur-sm`}>
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

const ProjectsTab = ({ getAdminToken }) => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/projects`, {
                headers: { 'admin-token': getAdminToken() }
            });
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/projects/${id}`, {
                method: 'DELETE',
                headers: { 'admin-token': getAdminToken() }
            });
            fetchProjects();
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Projects</h3>
                <button onClick={() => { setEditingProject(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                    <Plus size={18} /> Add Project
                </button>
            </div>
            {showForm && (
                <ProjectForm project={editingProject}
                    onSave={() => { setShowForm(false); setEditingProject(null); fetchProjects(); }}
                    onCancel={() => { setShowForm(false); setEditingProject(null); }}
                    getAdminToken={getAdminToken} />
            )}
            {loading ? (
                <div className="flex justify-center py-12">
                    <RefreshCw className="animate-spin text-blue-400" size={24} />
                    <span className="ml-2 text-gray-400">Loading...</span>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No projects yet. Add one!</p>
                        </div>
                    ) : projects.map(project => (
                        <div key={project._id} className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-white text-lg">{project.title}</h4>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">{project.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingProject(project); setShowForm(true); }} className="p-2 bg-blue-500/20 rounded-lg">
                                        <Edit className="text-blue-400" size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(project._id)} className="p-2 bg-red-500/20 rounded-lg">
                                        <Trash2 className="text-red-400" size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {project.technologies?.slice(0, 3).map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">{tech}</span>
                                ))}
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>{project.date}</span>
                                <div className="flex gap-2">
                                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16} /></a>}
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TechnologyInput = ({ technologies, setTechnologies }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!technologies.includes(input.trim())) setTechnologies([...technologies, input.trim()]);
            setInput('');
        }
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                {technologies.map((tech, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                        {tech}
                        <button type="button" onClick={() => setTechnologies(technologies.filter(t => t !== tech))}><X size={14} /></button>
                    </span>
                ))}
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 min-w-[120px]"
                    placeholder="Type and press Enter..." />
            </div>
        </div>
    );
};

const ProjectForm = ({ project, onSave, onCancel, getAdminToken }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', detailedDescription: '', technologies: [], category: 'Full Stack',
        date: new Date().getFullYear().toString(), githubUrl: '', liveUrl: '', status: 'Completed',
        features: [], challenges: '', lessons: '', screenshots: []
    });

    useEffect(() => {
        if (project) setFormData({
            title: project.title || '', description: project.description || '',
            detailedDescription: project.detailedDescription || '', technologies: project.technologies || [],
            category: project.category || 'Full Stack', date: project.date || new Date().getFullYear().toString(),
            githubUrl: project.githubUrl || '', liveUrl: project.liveUrl || '',
            status: project.status || 'Completed', features: project.features || [],
            challenges: project.challenges || '', lessons: project.lessons || '',
            screenshots: project.screenshots || []
        });
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = project
            ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/projects/${project._id}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/admin/projects`;
        const method = project ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'admin-token': getAdminToken() },
            body: JSON.stringify(formData)
        });
        if (res.ok) onSave();
        else console.error('Failed to save project', await res.json());
    };

    const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
    const updateFeature = (idx, val) => { const f = [...formData.features]; f[idx] = val; setFormData({ ...formData, features: f }); };
    const removeFeature = (idx) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== idx) });

    return (
        <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">{project ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                        <option>Frontend</option><option>Backend</option><option>Full Stack</option><option>Mobile</option>
                    </select>
                    <input type="text" placeholder="Date (e.g., 2024)" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                        <option>Completed</option><option>In Progress</option><option>Planning</option>
                    </select>
                </div>
                <textarea placeholder="Short Description *" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                <textarea placeholder="Detailed Description" rows="3" value={formData.detailedDescription} onChange={e => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                <TechnologyInput technologies={formData.technologies} setTechnologies={techs => setFormData({ ...formData, technologies: techs })} />
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Features</label>
                        <button type="button" onClick={addFeature} className="text-green-400 text-sm">+ Add Feature</button>
                    </div>
                    {formData.features.map((f, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`}
                                className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400" />
                            <button type="button" onClick={() => removeFeature(i)} className="text-red-400 px-2">✖</button>
                        </div>
                    ))}
                </div>
                <textarea placeholder="Challenges faced" rows="2" value={formData.challenges} onChange={e => setFormData({ ...formData, challenges: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                <textarea placeholder="Lessons learned" rows="2" value={formData.lessons} onChange={e => setFormData({ ...formData, lessons: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="url" placeholder="GitHub URL" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                    <input type="url" placeholder="Live Demo URL" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Screenshot URLs (one per line)</label>
                    <textarea placeholder="https://example.com/screenshot1.png" rows="3"
                        value={formData.screenshots.join('\n')}
                        onChange={e => setFormData({ ...formData, screenshots: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        {project ? 'Update Project' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ExperienceTab = ({ getAdminToken }) => {
    const [experiences, setExperiences] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchExperiences(); }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/experiences`, {
                headers: { 'admin-token': getAdminToken() }
            });
            const data = await res.json();
            setExperiences(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setExperiences([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this experience?')) {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/experiences/${id}`, {
                method: 'DELETE',
                headers: { 'admin-token': getAdminToken() }
            });
            fetchExperiences();
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Experience</h3>
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                    <Plus size={18} /> Add Experience
                </button>
            </div>
            {showForm && (
                <ExperienceForm experience={editing}
                    onSave={() => { setShowForm(false); setEditing(null); fetchExperiences(); }}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                    getAdminToken={getAdminToken} />
            )}
            {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-blue-400" size={24} /></div>
            ) : (
                <div className="space-y-4">
                    {experiences.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No experience added yet</p>
                        </div>
                    ) : experiences.map(exp => (
                        <div key={exp._id} className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg"><Briefcase className="text-blue-400" size={20} /></div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg">{exp.title}</h4>
                                        <p className="text-cyan-400">{exp.company}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditing(exp); setShowForm(true); }} className="p-2 bg-blue-500/20 rounded-lg">
                                        <Edit className="text-blue-400" size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(exp._id)} className="p-2 bg-red-500/20 rounded-lg">
                                        <Trash2 className="text-red-400" size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-gray-300"><Calendar size={16} className="text-blue-400" />{exp.period}</div>
                                <div className="flex items-center gap-2 text-gray-300"><MapPin size={16} className="text-cyan-400" />{exp.location}</div>
                            </div>
                            <p className="text-gray-300 mb-4">{exp.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {exp.technologies?.map((tech, i) => <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">{tech}</span>)}
                            </div>
                            {exp.achievements?.map((ach, i) => (
                                <div key={i} className="flex items-center gap-2 mt-1">
                                    <Award className="text-green-400" size={14} />
                                    <span className="text-green-300 text-sm">{ach}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ExperienceForm = ({ experience, onSave, onCancel, getAdminToken }) => {
    const [formData, setFormData] = useState({
        title: '', company: '', period: '', location: '', type: 'Full-time',
        description: '', technologies: [], achievements: []
    });

    useEffect(() => {
        if (experience) setFormData({
            title: experience.title || '', company: experience.company || '',
            period: experience.period || '', location: experience.location || '',
            type: experience.type || 'Full-time', description: experience.description || '',
            technologies: experience.technologies || [], achievements: experience.achievements || []
        });
    }, [experience]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = experience
            ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/experiences/${experience._id}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/admin/experiences`;
        const method = experience ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'admin-token': getAdminToken() },
            body: JSON.stringify(formData)
        });
        if (res.ok) onSave();
        else console.error('Failed to save experience', await res.json());
    };

    return (
        <div className="bg-gray-700/20 rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">{experience ? 'Edit Experience' : 'New Experience'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Job Title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                    <input type="text" placeholder="Company *" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                    <input type="text" placeholder="Period (e.g., 2022 – 2023) *" value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                    <input type="text" placeholder="Location *" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Freelance</option>
                    </select>
                </div>
                <textarea placeholder="Description *" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" required />
                <input type="text" placeholder="Technologies (comma separated)" value={formData.technologies.join(', ')}
                    onChange={e => setFormData({ ...formData, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                <textarea placeholder="Achievements (one per line)" rows="3" value={formData.achievements.join('\n')}
                    onChange={e => setFormData({ ...formData, achievements: e.target.value.split('\n').filter(s => s.trim()) })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400" />
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        {experience ? 'Update Experience' : 'Create Experience'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Calendar, Code, Users, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';

const Projects = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://server-bagw.onrender.com/api/admin/projects');
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (project) => {
        const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        navigate(`/projects/${slug}`, { state: { project } });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Full Stack': 'from-blue-500 to-cyan-500',
            'Frontend': 'from-purple-500 to-pink-500',
            'Backend': 'from-green-500 to-emerald-500',
            'Mobile': 'from-orange-500 to-red-500'
        };
        return colors[category] || 'from-blue-500 to-cyan-500';
    };

    if (loading) {
        return (
            <section className="min-h-screen py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">Loading projects...</p>
                </div>
            </section>
        );
    }

    return (
        <motion.section
            id="projects"
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="min-h-screen py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            My Projects
                        </span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={inView ? { opacity: 1, width: 100 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full w-24"
                    />
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto"
                    >
                        Here are some of my recent projects that showcase my skills and passion for development
                    </motion.p>
                </motion.div>

                {/* Projects Container */}
                <div className="relative">
                    {/* Top Glowing Effect */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-500/20 via-cyan-500/10 to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Bottom Glowing Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-500/20 via-cyan-500/10 to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Scroll Container */}
                    <div className="h-[700px] overflow-y-auto pr-4 custom-scrollbar relative">
                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-4"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project._id || index}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="group"
                                >
                                    <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
                                        {/* Project Image */}
                                        <div className="relative overflow-hidden h-48">
                                            {project.screenshots && project.screenshots.length > 0 ? (
                                                <img 
                                                    src={project.screenshots[0]} 
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                                    <Code className="text-blue-400" size={48} />
                                                </div>
                                            )}
                                            
                                            {/* Category Badge */}
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white text-sm font-medium`}>
                                                {project.category}
                                            </div>

                                            {/* Status Badge */}
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border ${
                                                project.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                            }`}>
                                                {project.status}
                                            </div>
                                        </div>

                                        {/* Project Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                
                                                <p className="text-gray-300 mb-4 leading-relaxed">
                                                    {project.description}
                                                </p>

                                                {/* Technologies */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {Array.isArray(project.technologies) && project.technologies.map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Project Footer */}
                                            <div className="flex items-center pt-4 border-t border-gray-700/50 flex-col-reverse md:flex-row gap-4">
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        <span>{project.date}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 ">
                                                    {/* View Details Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleViewDetails(project)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                                                    >
                                                        <Eye size={18} />
                                                        <span className="text-sm font-medium">Details</span>
                                                    </motion.button>

                                                    {/* GitHub Button */}
                                                    {project.githubUrl && (
                                                        <motion.a
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                                                        >
                                                            <Github size={18} />
                                                            <span className="text-sm font-medium">Code</span>
                                                        </motion.a>
                                                    )}

                                                    {/* Live Demo Button */}
                                                    {project.liveUrl && (
                                                        <motion.a
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg border border-blue-400 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                                        >
                                                            <ExternalLink size={18} />
                                                            <span className="text-sm font-medium">Live Demo</span>
                                                        </motion.a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Custom Scrollbar Styling */}
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(75, 85, 99, 0.3);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, #3b82f6, #06b6d4);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, #2563eb, #0891b2);
                    }
                `}</style>
            </div>
        </motion.section>
    );
};

export default Projects;
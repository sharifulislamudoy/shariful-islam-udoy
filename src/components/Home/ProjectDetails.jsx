import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ExternalLink, Github, Calendar, Code, Users, Clock, Target } from 'lucide-react';
import CustomCursor from '../Custom-Cursor/CustomCursor';

const ProjectDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [project, setProject] = useState(location.state?.project || null);
    const [loading, setLoading] = useState(!project);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!project && params.slug) {
            const fetchProjectBySlug = async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`);
                    const projects = await res.json();
                    const found = projects.find(p => 
                        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.slug
                    );
                    setProject(found || null);
                } catch (error) {
                    console.error(error);
                    setProject(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchProjectBySlug();
        } else if (project) {
            setLoading(false);
        }
    }, [project, params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">Loading project...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <Helmet><title>Project Not Found | SHARIF.</title></Helmet>
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">Project Not Found</h2>
                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const createSlug = (title) => {
        return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    };
    const projectSlug = createSlug(project.title);
    const canonicalUrl = `https://sharif.com/projects/${projectSlug}`;
    const pageTitle = `${project.title} | ${project.category} Project | SHARIF.`;
    const pageDescription = project.detailedDescription || project.description;
    const keywords = `${project.technologies.join(', ')}, ${project.category}, web development, portfolio, ${project.title}`;

    const getCategoryColor = (category) => {
        const colors = {
            'Full Stack': 'from-blue-500 to-cyan-500',
            'Frontend': 'from-purple-500 to-pink-500',
            'Backend': 'from-green-500 to-emerald-500',
            'Mobile': 'from-orange-500 to-red-500'
        };
        return colors[category] || 'from-blue-500 to-cyan-500';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 lg:px-13">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={keywords} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                {project.screenshots?.[0] && <meta property="og:image" content={project.screenshots[0]} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                {project.screenshots?.[0] && <meta name="twitter:image" content={project.screenshots[0]} />}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": project.title,
                        "description": pageDescription,
                        "applicationCategory": "DeveloperApplication",
                        "operatingSystem": "Web",
                        "author": { "@type": "Person", "name": "Sharif" },
                        "datePublished": project.date
                    })}
                </script>
            </Helmet>
            <CustomCursor />
            <div className="max-w-6xl mx-auto">
                <motion.button variants={itemVariants} onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /><span>Back to Projects</span>
                </motion.button>
                <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700/50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white text-sm font-medium`}>
                                    {project.category}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                                    {project.status}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
                            <p className="text-xl text-gray-300 mb-6">{project.description}</p>
                            <div className="flex items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-2"><Calendar size={20} /><span>{project.date}</span></div>
                                <div className="flex items-center gap-2"><Code size={20} /><span>{project.technologies.length} Technologies</span></div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {project.githubUrl && (
                                <motion.a whileHover={{ scale: 1.05 }} href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 hover:text-white">
                                    <Github size={20} /><span>View Code</span>
                                </motion.a>
                            )}
                            {project.liveUrl && (
                                <motion.a whileHover={{ scale: 1.05 }} href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg border border-blue-400 hover:from-blue-600 hover:to-cyan-600">
                                    <ExternalLink size={20} /><span>Live Demo</span>
                                </motion.a>
                            )}
                        </div>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Target size={24} className="text-blue-400" />Project Overview</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">{project.detailedDescription}</p>
                        </motion.div>
                        {project.features && project.features.length > 0 && (
                            <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Users size={24} className="text-green-400" />Key Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {project.screenshots && project.screenshots.length > 0 && (
                            <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                                <h2 className="text-2xl font-bold text-white mb-6">Project Screenshots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.screenshots.map((scr, idx) => (
                                        <div key={idx} className="rounded-lg overflow-hidden border border-gray-600/50">
                                            <img src={scr} alt={`${project.title} screenshot ${idx+1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div className="space-y-8">
                        <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                            <h3 className="text-xl font-bold text-white mb-6">Technologies Used</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50 hover:border-blue-400/50">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                            <h3 className="text-xl font-bold text-white mb-6">Project Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50"><span className="text-gray-400">Category</span><span className="text-white font-medium">{project.category}</span></div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50"><span className="text-gray-400">Status</span><span className="text-green-400 font-medium">{project.status}</span></div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50"><span className="text-gray-400">Date</span><span className="text-white font-medium">{project.date}</span></div>
                                <div className="flex justify-between items-center py-2"><span className="text-gray-400">Technologies</span><span className="text-white font-medium">{project.technologies.length}</span></div>
                            </div>
                        </motion.div>
                        {project.challenges && (
                            <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Clock size={20} className="text-orange-400" />Challenges</h3>
                                <p className="text-gray-300 leading-relaxed">{project.challenges}</p>
                            </motion.div>
                        )}
                        {project.lessons && (
                            <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Code size={20} className="text-purple-400" />Lessons Learned</h3>
                                <p className="text-gray-300 leading-relaxed">{project.lessons}</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectDetails;
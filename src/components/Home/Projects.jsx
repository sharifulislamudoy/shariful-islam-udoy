import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Calendar, Code, Users, ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';

const Projects = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    
    const navigate = useNavigate();

    const projects = [
        {
            id: 1,
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, admin dashboard, and real-time inventory management.",
            image: "/projects/ecommerce.jpg",
            technologies: ["React.js", "Node.js", "MongoDB", "Express", "Stripe"],
            githubUrl: "https://github.com/udoy/ecommerce",
            liveUrl: "https://ecommerce-udoy.vercel.app",
            category: "Full Stack",
            date: "2024",
            status: "Completed",
            detailedDescription: "This e-commerce platform is a comprehensive solution built with modern technologies. It includes features like user authentication with JWT, product catalog with search and filtering, shopping cart functionality, secure payment processing with Stripe, order management, and an admin dashboard for inventory and sales analytics.",
            features: [
                "User authentication & authorization",
                "Product catalog with search & filters",
                "Shopping cart & wishlist",
                "Secure payment processing (Stripe)",
                "Order tracking & management",
                "Admin dashboard with analytics",
                "Real-time inventory updates",
                "Customer reviews & ratings"
            ],
            challenges: "Implementing real-time inventory management while handling concurrent user purchases required careful database transaction handling and optimistic locking strategies.",
            lessons: "Learned about payment gateway integration, secure authentication practices, and building scalable backend architecture.",
            screenshots: [
                "/projects/ecommerce-1.jpg",
                "/projects/ecommerce-2.jpg",
                "/projects/ecommerce-3.jpg"
            ]
        },
        {
            id: 2,
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
            image: "/projects/taskmanager.jpg",
            technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io", "Tailwind"],
            githubUrl: "https://github.com/udoy/taskmanager",
            liveUrl: "https://taskmanager-udoy.vercel.app",
            category: "Frontend",
            date: "2024",
            status: "Completed",
            detailedDescription: "A modern task management application designed for team collaboration. Features real-time updates, drag-and-drop functionality, and comprehensive project management tools.",
            features: [
                "Real-time task updates",
                "Drag & drop interface",
                "Team collaboration",
                "Project timelines",
                "File attachments",
                "Progress tracking",
                "Multiple workspaces"
            ],
            challenges: "Implementing real-time synchronization across multiple clients while maintaining data consistency was challenging.",
            lessons: "Gained expertise in WebSockets, real-time data handling, and TypeScript implementation.",
            screenshots: [
                "/projects/taskmanager-1.jpg",
                "/projects/taskmanager-2.jpg",
                "/projects/taskmanager-3.jpg"
            ]
        },
        {
            id: 3,
            title: "Weather Dashboard",
            description: "A beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics.",
            image: "/projects/weather.jpg",
            technologies: ["React.js", "Chart.js", "OpenWeather API", "Leaflet", "CSS3"],
            githubUrl: "https://github.com/udoy/weather-dashboard",
            liveUrl: "https://weather-udoy.vercel.app",
            category: "Frontend",
            date: "2023",
            status: "Completed",
            detailedDescription: "A comprehensive weather dashboard that provides detailed weather information with beautiful visualizations and interactive maps.",
            features: [
                "Location-based weather",
                "7-day forecast",
                "Interactive maps",
                "Weather charts & graphs",
                "Severe weather alerts",
                "Multiple location support",
                "Responsive design"
            ],
            challenges: "Handling multiple API calls efficiently and creating responsive weather visualizations that work across different screen sizes.",
            lessons: "Learned about data visualization with Chart.js and working with external APIs effectively.",
            screenshots: [
                "/projects/weather-1.jpg",
                "/projects/weather-2.jpg",
                "/projects/weather-3.jpg"
            ]
        },
        {
            id: 4,
            title: "Social Media API",
            description: "A robust backend API for social media platform with features like posts, comments, likes, and real-time messaging.",
            image: "/projects/social-api.jpg",
            technologies: ["Node.js", "Express", "MongoDB", "JWT", "WebSockets"],
            githubUrl: "https://github.com/udoy/social-api",
            liveUrl: "https://social-api-udoy.herokuapp.com",
            category: "Backend",
            date: "2023",
            status: "Completed",
            detailedDescription: "A complete backend API for a social media platform with all the essential features needed for modern social networking.",
            features: [
                "User authentication & profiles",
                "Post creation & management",
                "Comments & likes system",
                "Real-time messaging",
                "File upload handling",
                "Follow/unfollow system",
                "News feed algorithm"
            ],
            challenges: "Building a scalable real-time messaging system and implementing efficient news feed algorithms.",
            lessons: "Deepened understanding of WebSocket implementation and database optimization for social features.",
            screenshots: [
                "/projects/social-api-1.jpg",
                "/projects/social-api-2.jpg",
                "/projects/social-api-3.jpg"
            ]
        },
        {
            id: 5,
            title: "Portfolio Website",
            description: "A responsive portfolio website with modern design, animations, and interactive elements to showcase my work and skills.",
            image: "/projects/portfolio.jpg",
            technologies: ["React.js", "Framer Motion", "Tailwind CSS", "Vite"],
            githubUrl: "https://github.com/udoy/portfolio",
            liveUrl: "https://udoy.dev",
            category: "Frontend",
            date: "2024",
            status: "Completed",
            detailedDescription: "A modern, responsive portfolio website showcasing my projects and skills with smooth animations and interactive elements.",
            features: [
                "Responsive design",
                "Smooth animations",
                "Dark/light theme",
                "Project showcase",
                "Contact form",
                "SEO optimized",
                "Fast loading"
            ],
            challenges: "Creating performant animations that work smoothly across all devices and browsers.",
            lessons: "Mastered Framer Motion for animations and learned advanced Tailwind CSS techniques.",
            screenshots: [
                "/projects/portfolio-1.jpg",
                "/projects/portfolio-2.jpg",
                "/projects/portfolio-3.jpg"
            ]
        },
        {
            id: 6,
            title: "Chat Application",
            description: "Real-time chat application with multiple rooms, file sharing, and user presence indicators.",
            image: "/projects/chat-app.jpg",
            technologies: ["React.js", "Node.js", "Socket.io", "MongoDB", "JWT"],
            githubUrl: "https://github.com/udoy/chat-app",
            liveUrl: "https://chat-udoy.vercel.app",
            category: "Full Stack",
            date: "2024",
            status: "Completed",
            detailedDescription: "A feature-rich real-time chat application supporting multiple rooms, file sharing, and advanced user presence features.",
            features: [
                "Real-time messaging",
                "Multiple chat rooms",
                "File & image sharing",
                "User presence indicators",
                "Message history",
                "Typing indicators",
                "User profiles"
            ],
            challenges: "Handling real-time data synchronization and file uploads efficiently while maintaining application performance.",
            lessons: "Learned about real-time application architecture and file handling in chat applications.",
            screenshots: [
                "/projects/chat-app-1.jpg",
                "/projects/chat-app-2.jpg",
                "/projects/chat-app-3.jpg"
            ]
        }
    ];

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

                {/* Projects Container with Fixed Height, Scroll and Glowing Effects */}
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
                                    key={project.id}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="group"
                                >
                                    <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
                                        {/* Project Image */}
                                        <div className="relative overflow-hidden">
                                            <div className="h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                                <Code className="text-blue-400" size={48} />
                                            </div>
                                            
                                            {/* Category Badge */}
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white text-sm font-medium`}>
                                                {project.category}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
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
                                                    {project.technologies.map((tech, techIndex) => (
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
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        <span>{project.date}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
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

                                                    {/* Live Demo Button */}
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
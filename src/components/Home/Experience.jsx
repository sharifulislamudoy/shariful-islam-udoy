import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Briefcase,
    Calendar,
    MapPin,
    Award,
    TrendingUp,
    Users,
    Code,
    Database,
    Palette
} from 'lucide-react';

const Experience = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/experiences');
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
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
            scale: 1.02,
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section
            id="experience"
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
                            Experience
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
                        My journey through various roles and technologies that shaped my development career
                    </motion.p>
                </motion.div>

                {/* Experience Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {experiences.map((experience, index) => (
                        <motion.div
                            key={experience.id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                            <experience.icon className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                                                {experience.title}
                                            </h3>
                                            <p className="text-cyan-400 font-semibold">{experience.company}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 mb-4 flex-grow">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Calendar className="text-blue-400" size={16} />
                                        <span className="text-sm">{experience.period}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin className="text-cyan-400" size={16} />
                                        <span className="text-sm">{experience.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Briefcase className="text-blue-400" size={16} />
                                        <span className="text-sm">{experience.type}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {experience.description}
                                    </p>

                                    {/* Achievements */}
                                    <div className="space-y-2">
                                        {experience.achievements.map((achievement, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Award className="text-green-400" size={14} />
                                                <span className="text-green-300 text-sm">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div className="pt-4 border-t border-gray-700/50">
                                    <div className="flex flex-wrap gap-2">
                                        {experience.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md text-xs border border-blue-500/20"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Timeline Connector (Optional) */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mt-12"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
                        <TrendingUp className="text-cyan-400" size={20} />
                        <span className="text-gray-300">Continuing to grow and learn new technologies</span>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Experience;
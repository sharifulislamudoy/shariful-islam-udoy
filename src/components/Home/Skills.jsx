import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Code,
    Database,
    Server,
    Palette,
    Globe,
    Smartphone,
    Cpu,
    GitBranch,
    Cloud,
    Shield,
    Zap,
    Layout
} from 'lucide-react';

const Skills = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const skillCategories = [
        {
            title: "Frontend Development",
            icon: Layout,
            skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Redux"],
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Backend Development",
            icon: Server,
            skills: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT", "Socket.io"],
            color: "from-green-500 to-emerald-500"
        },
        {
            title: "Tools & Technologies",
            icon: Cpu,
            skills: ["Git", "Docker", "VS Code", "Postman", "Figma", "Webpack", "Vite"],
            color: "from-purple-500 to-pink-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
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
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section
            id="skills"
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-gray-800"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-12"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Technical Skills
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        Technologies and tools I work with to create amazing digital experiences
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={inView ? { opacity: 1, width: 80 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full w-20 mt-4"
                    />
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group relative"
                        >
                            {/* Background Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                            
                            {/* Card */}
                            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300 h-full">
                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}
                                >
                                    <category.icon className="text-white" size={24} />
                                </motion.div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {category.title}
                                </h3>

                                {/* Skills List */}
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, skillIndex) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{
                                                duration: 0.4,
                                                delay: 0.3 + (index * 0.1) + (skillIndex * 0.05)
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg text-sm font-medium border border-gray-600 hover:border-gray-500 transition-all duration-200"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Skills;
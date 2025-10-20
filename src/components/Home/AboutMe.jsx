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
    Award,
    Clock,
    MapPin,
    GraduationCap,
    Mail,
    Phone
} from 'lucide-react';

const AboutMe = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const stats = [
        { icon: Clock, value: '2+ Years', label: 'Experience' },
        { icon: Award, value: '15+', label: 'Projects' },
        { icon: Globe, value: '5+', label: 'Technologies' },
        { icon: Smartphone, value: '10+', label: 'Clients' }
    ];

    const skills = [
        { name: 'Frontend', technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'], icon: Palette },
        { name: 'Backend', technologies: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'], icon: Server },
        { name: 'Tools', technologies: ['Git', 'Docker', 'VS Code', 'Postman'], icon: Code }
    ];

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

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -5 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section
            id="about"
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
                            About Me
                        </span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={inView ? { opacity: 1, width: 100 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full w-24"
                    />
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Side - Image */}
                    <motion.div
                        variants={imageVariants}
                        className="lg:w-2/5 flex justify-center"
                    >
                        <div className="relative">
                            {/* Main Image Container */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative z-10"
                            >
                                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-2xl">
                                    <img
                                        src="/udoy-image.jpg"
                                        alt="Shariful Islam Udoy"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    {/* Fallback placeholder */}
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center hidden">
                                        <div className="text-white text-center">
                                            <div className="text-4xl font-bold mb-2">SU</div>
                                            <div className="text-sm">Shariful Islam Udoy</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-4 -right-4 bg-blue-500 rounded-lg p-3 shadow-lg"
                                >
                                    <Code className="text-white" size={20} />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        y: [0, -15, 0],
                                        rotate: [0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                    className="absolute -bottom-4 -left-4 bg-cyan-500 rounded-lg p-3 shadow-lg"
                                >
                                    <Database className="text-white" size={20} />
                                </motion.div>
                            </motion.div>

                            {/* Background Glow */}
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl -z-10"
                            />
                        </div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        variants={containerVariants}
                        className="lg:w-3/5 space-y-8"
                    >
                        {/* Introduction */}
                        <motion.div variants={itemVariants}>
                            <motion.h3
                                initial={{ opacity: 0, x: 30 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-2xl md:text-3xl font-bold text-white mb-4"
                            >
                                Full Stack Developer & Problem Solver
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, x: 30 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg text-gray-300 leading-relaxed mb-4"
                            >
                                Hello! I'm <span className="text-blue-400 font-semibold">Shariful Islam Udoy</span>,
                                a passionate Full Stack Developer with 2+ years of experience crafting digital solutions
                                that make a difference. I specialize in the MERN stack and modern web technologies.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, x: 30 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-lg text-gray-300 leading-relaxed"
                            >
                                Currently pursuing my BSc in Mathematics at Dhaka College, I bring analytical thinking
                                and problem-solving skills to every project. I believe in writing clean, efficient code
                                and creating user experiences that are both beautiful and functional.
                            </motion.p>
                        </motion.div>

                        {/* Personal Info */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <MapPin className="text-blue-400" size={20} />
                                <span>Bangladesh</span>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <GraduationCap className="text-cyan-400" size={20} />
                                <span>BSc Mathematics - Dhaka College</span>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <Mail className="text-blue-400" size={20} />
                                <span>sharifulislamudoy56@gmail.com</span>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <Phone className="text-cyan-400" size={20} />
                                <span>+880 19953 22033</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutMe;
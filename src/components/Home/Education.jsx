import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';

const Education = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const educationData = [
        {
            degree: "Bachelor of Science in Mathematics",
            institution: "Dhaka College",
            duration: "2022 - Present",
            location: "Dhaka, Bangladesh",
            description: "Specializing in Applied Mathematics and Computational Methods. Relevant coursework includes Advanced Calculus, Linear Algebra, Probability Theory, and Numerical Analysis.",
            icon: GraduationCap,
            color: "from-blue-500 to-cyan-500"
        },
        {
            degree: "Higher Secondary Certificate (HSC)",
            institution: "R.K Chowdhury University & College",
            duration: "2019 - 2021",
            location: "Dhaka, Bangladesh",
            description: "Science Group with focus on Physics, Chemistry, and Higher Mathematics. Achieved perfect GPA with distinction in Mathematics.",
            icon: Award,
            color: "from-purple-500 to-pink-500"
        },
        {
            degree: "Secondary School Certificate (SSC)",
            institution: "Jurain Ashraf Master Adasha High School",
            duration: "2017 - 2019",
            location: "Dhaka, Bangladesh",
            description: "Science Group with outstanding performance in Mathematics and Computer Science. Received General Scholarship for academic excellence.",
            icon: BookOpen,
            color: "from-green-500 to-emerald-500"
        }
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
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section
            id="education"
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className=" py-35 lg:px-13 bg-gradient-to-br from-gray-900 via-black to-gray-900"
        >
            <div className="w-11/12 mx-auto">
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
                            Education
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
                        className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto"
                    >
                        My academic journey and continuous learning path in the field of 
                        Mathematics and Computer Science.
                    </motion.p>
                </motion.div>

                {/* Education Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
                >
                    {educationData.map((edu, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 h-full relative overflow-hidden">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${edu.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                                
                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-14 h-14 rounded-lg bg-gradient-to-r ${edu.color} p-3 mb-4 relative z-10`}
                                >
                                    <edu.icon className="text-white" size={28} />
                                </motion.div>

                                {/* Degree & Institution */}
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                                    {edu.degree}
                                </h3>
                                <p className="text-blue-400 font-semibold mb-4 relative z-10">
                                    {edu.institution}
                                </p>

                                {/* Details */}
                                <div className="space-y-3 mb-4 relative z-10">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Calendar size={16} className="text-cyan-400" />
                                        <span className="text-sm">{edu.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin size={16} className="text-blue-400" />
                                        <span className="text-sm">{edu.location}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                                    {edu.description}
                                </p>

                                {/* Hover Effect Border */}
                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${edu.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}>
                                    <div className="absolute inset-[2px] rounded-xl bg-gray-900" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Education;
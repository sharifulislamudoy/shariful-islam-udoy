import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, FileText, Image, Download } from 'lucide-react';

const Achievements = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const achievementsData = [
        {
            title: "Complete Web Development Course",
            organization: "Programming Hero",
            year: "2025",
            description: "Recognized for outstanding academic performance with perfect GPA in consecutive semesters. Maintained top 2% of the class.",
            driveLink: "https://drive.google.com/file/d/1Qa7Xyx-lOn6JfPmG5EzlyTYj9kzz64z9/view?usp=drive_link",
            previewType: "certificate",
            color: "from-purple-500 to-indigo-500"
        },
        {
            title: "Web Design and Development",
            organization: "NSDA",
            year: "2025",
            description: "Recognized for outstanding academic performance with perfect GPA in consecutive semesters. Maintained top 2% of the class.",
            driveLink: "https://drive.google.com/file/d/1pOIytWLfQ7KZLyiXvhNYGexRU9GHNz8V/view?usp=drive_link",
            previewType: "certificate",
            color: "from-yellow-500 to-orange-500"
        },
        // ... other achievements
    ];

    // Function to get direct download link (works for publicly accessible files)
    const getDriveDownloadLink = (driveLink) => {
        const fileId = driveLink.match(/\/d\/([^\/]+)/)?.[1];
        if (fileId) {
            return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
        return driveLink;
    };

    // Function to get preview link
    const getDrivePreviewLink = (driveLink) => {
        const fileId = driveLink.match(/\/d\/([^\/]+)/)?.[1];
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return driveLink;
    };

    // Function to handle download with proper error handling
    const handleDownload = async (driveLink, title) => {
        try {
            const downloadLink = getDriveDownloadLink(driveLink);
            
            // Method 1: Direct download approach
            const link = document.createElement('a');
            link.href = downloadLink;
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Fallback: If direct download doesn't work, open in new tab
            setTimeout(() => {
                // Check if download started, if not open preview
                window.open(downloadLink, '_blank');
            }, 1000);
            
        } catch (error) {
            console.error('Download error:', error);
            // Fallback to opening in new tab
            window.open(driveLink, '_blank');
        }
    };

    // Function to handle opening in drive
    const handleOpenInDrive = (driveLink) => {
        // Always open in new tab for better user experience
        window.open(driveLink, '_blank', 'noopener,noreferrer');
    };

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
            scale: 1.03,
            y: -8,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section
            id="achievement"
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="min-h-screen py-20 lg:px-13 bg-gradient-to-br from-gray-900 via-black to-gray-900"
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
                            Achievements
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
                        Recognitions and accomplishments that highlight my dedication and
                        excellence in academics, research, and competitions.
                    </motion.p>
                </motion.div>

                {/* Achievements Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                    {achievementsData.map((achievement, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 h-full relative overflow-hidden">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                                {/* Year Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${achievement.color} text-white`}>
                                        {achievement.year}
                                    </span>
                                </div>

                                {/* Title & Organization */}
                                <h3 className="text-xl font-bold text-white mb-2 pr-16">
                                    {achievement.title}
                                </h3>
                                <p className="text-yellow-400 font-semibold mb-4">
                                    {achievement.organization}
                                </p>

                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {achievement.description}
                                </p>

                                {/* Drive Preview and Actions */}
                                <div className="space-y-4">
                                    {/* Preview Iframe */}
                                    <div className="relative rounded-lg overflow-hidden border border-gray-600 bg-gray-900">
                                        <div className="aspect-video">
                                            <iframe
                                                src={getDrivePreviewLink(achievement.driveLink)}
                                                className="w-full h-full"
                                                title={`Preview of ${achievement.title}`}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-yellow-500/30 transition-all duration-300" />
                                    </div>

                                    {/* Action Buttons */}
                                    {/* <div className="flex gap-3">
                                        <motion.button
                                            onClick={() => handleOpenInDrive(achievement.driveLink)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                                        >
                                            <ExternalLink size={16} />
                                            Open in Drive
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDownload(achievement.driveLink, achievement.title)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-300"
                                        >
                                            <Download size={16} />
                                        </motion.button>
                                    </div> */}
                                </div>

                                {/* Hover Effect Border */}
                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}>
                                    <div className="absolute inset-[2px] rounded-xl bg-gray-900" />
                                </div>

                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Note Section */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 max-w-2xl mx-auto"
                >
                    <p className="text-gray-400 text-sm">
                        <strong>Note:</strong> All certificates and documents are hosted on Google Drive.
                        You can view them directly in the preview or open in Drive for full functionality.
                        For downloading, you might need to confirm the download in the new tab that opens.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Achievements;
import React from 'react';
import { motion } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const LoadingSpinner = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex justify-center items-center z-50"
        >
            <div className="relative w-full h-full flex justify-center items-center">
                {/* Left Arrow - বাম দিক থেকে আসবে */}
                <motion.div
                    initial={{ x: "-100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut",
                        delay: 0.2
                    }}
                    className="absolute text-6xl md:text-8xl text-blue-500 drop-shadow-lg z-20"
                    style={{ 
                        textShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6',
                        left: '40%'
                    }}
                >
                    <IoIosArrowBack />
                </motion.div>

                {/* Right Arrow - ডান দিক থেকে আসবে */}
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut",
                        delay: 0.2
                    }}
                    className="absolute text-6xl md:text-8xl text-blue-500 drop-shadow-lg z-20"
                    style={{ 
                        textShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6',
                        right: '40%'
                    }}
                >
                    <IoIosArrowForward />
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100vh" }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 1.8
                    }}
                    className="absolute w-2 bg-gradient-to-b from-blue-500 to-blue-400 rounded shadow-lg z-10"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(20deg)',
                        transformOrigin: 'center',
                        boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6'
                    }}
                />
            </div>
        </motion.div>
    );
};

export default LoadingSpinner;
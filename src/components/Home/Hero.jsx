import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center items-center px-10 text-center bg-black to-slate-800"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
      >
        Welcome to SlashDiv
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl lg:text-2xl mb-10 max-w-4xl leading-relaxed text-slate-300"
      >
        Where innovation meets execution. Our platform helps you create amazing web experiences with cutting-edge technology.
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          boxShadow: '0 0 20px #3b82f6',
          y: -3
        }}
        whileTap={{ scale: 0.95 }}
        className="px-12 py-4 bg-transparent border-2 border-blue-500 text-blue-500 text-xl rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden"
      >
        Explore Features
      </motion.button>
    </motion.section>
  );
};

export default Hero;
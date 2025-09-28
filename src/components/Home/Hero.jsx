import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Database, Palette, Rocket } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "MERN Stack Developer",
    "Next.js Developer", 
    "Full Stack Developer",
    "React.js Specialist"
  ];

  useEffect(() => {
    const currentRoleText = roles[currentRole];
    
    if (currentIndex < currentRoleText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentRoleText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentRole]);

  const downloadResume = () => {
    // Replace with your actual resume file path
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Shariful_Islam_Udoy_Resume.pdf';
    link.click();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20"
    >
      {/* Left Side - Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:w-1/2 text-left mb-12 lg:mb-0"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Shariful Islam Udoy
          </span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-300 font-mono min-h-[60px]"
        >
          <span className="text-blue-400">{displayText}</span>
          <span className="animate-pulse">|</span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl"
        >
          Passionate about creating innovative web solutions using modern technologies. 
          Specializing in MongoDB, Express.js, React.js, Node.js, and Next.js to build 
          scalable and performant applications.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadResume}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-md rounded-lg cursor-pointer flex items-center gap-3 font-semibold"
        >
          <Download size={20} />
          Download Resume
        </motion.button>

        {/* Tech Stack Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex gap-6 mt-8"
        >
          {[Code, Database, Palette, Rocket].map((Icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="p-3 bg-gray-800 rounded-lg"
            >
              <Icon className="text-blue-400" size={24} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - VS Code Mockup */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="lg:w-1/2 w-full max-w-2xl hidden md:block"
      >
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          {/* VS Code Header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-sm ml-4">portfolio.jsx</div>
          </div>
          
          {/* VS Code Content */}
          <div className="p-6 font-mono text-sm">
            <div className="text-gray-600 mb-4">
              <span className="text-purple-500">const</span>{' '}
              <span className="text-blue-400">developer</span> = {'{'}
            </div>
            
            <div className="ml-4 text-gray-300">
              <div>
                <span className="text-green-400">name:</span>{' '}
                <span className="text-yellow-300">"Shariful Islam Udoy"</span>,
              </div>
              <div>
                <span className="text-green-400">role:</span>{' '}
                <span className="text-cyan-400">{`"${displayText}`}</span>
                <span className="animate-pulse">|</span>
                <span>{`"`}</span>,
              </div>
              <div>
                <span className="text-green-400">skills:</span> [
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"React.js"</span>,
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"Next.js"</span>,
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"Node.js"</span>,
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"MongoDB"</span>,
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"Express.js"</span>,
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">"Redux Toolkit"</span>
              </div>
              <div>],</div>
            </div>
            
            <div className="text-gray-600">{'};'}</div>
            
            <div className="mt-4 text-gray-600">
              <span className="text-purple-500">function</span>{' '}
              <span className="text-blue-400">buildProject</span>() {'{'}
            </div>
            <div className="ml-4 text-gray-300">
              <span className="text-purple-500">return</span>{' '}
              <span className="text-cyan-400">&lt;AmazingWebsite /&gt;</span>;
            </div>
            <div className="text-gray-600">{'}'}</div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
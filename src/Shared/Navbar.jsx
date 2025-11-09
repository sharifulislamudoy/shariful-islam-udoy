// components/Navbar.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Menu, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Achievements', href: '#achievement' },
    { name: 'Contact Me', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = navItems.map(item => item.href.substring(1));
      
      // Calculate the offset considering navbar height
      const navbarHeight = 80; // Approximate navbar height in pixels
      const offset = navbarHeight + 20; // Additional 20px buffer
      
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if element is in viewport with offset
          return rect.top <= offset && rect.bottom >= offset;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    // Check if user is admin
    const checkAdminStatus = () => {
      const token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('adminTokenExpiry');
      
      if (token && expiry && new Date().getTime() < parseInt(expiry)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    checkAdminStatus();
    
    // Set up interval to check admin status
    const interval = setInterval(checkAdminStatus, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 80; // Same as in handleSectionChange
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/admin');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-transparent backdrop-blur-md border-b border-gray-800 shadow-2xl' 
          : 'bg-gradient-to-lr from-gray-900 via-black to-gray-900/95 backdrop-blur-sm'
      }`}
    >
      <div className="w-11/12 mx-auto px-2 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left Side */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('#home')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="text-white" size={24} />
              </div>
              <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-lg opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none">
                Shariful
              </span>
              <span className="text-cyan-400 text-sm font-medium">
                MERN Stack
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    activeSection === item.href.substring(1)
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full ${
                      activeSection === item.href.substring(1) ? 'w-full' : ''
                    }`}
                  />
                </button>
              </motion.div>
            ))}
            
            {/* Admin Button - Only show when logged in */}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleAdminClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                <Shield size={16} />
                Dashboard
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 border border-gray-700 rounded-lg bg-gray-950 text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-black backdrop-blur-md rounded-lg border border-gray-700"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-6 py-3 text-base font-medium transition-all duration-200 ${
                  activeSection === item.href.substring(1)
                    ? 'text-cyan-400 bg-gray-700/50 border-r-2 border-cyan-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {item.name}
              </motion.button>
            ))}
            
            {/* Admin Button for Mobile */}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                onClick={handleAdminClick}
                className="flex items-center gap-3 w-full text-left px-6 py-3 text-base font-medium text-purple-300 bg-purple-500/20 border-r-2 border-purple-400 hover:bg-purple-500/30 transition-all"
              >
                <Shield size={18} />
                Admin Dashboard
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
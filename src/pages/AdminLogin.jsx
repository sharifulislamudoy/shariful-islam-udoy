// pages/Admin/AdminLogin.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, Code2, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_CREDENTIALS = {
    username: 'sharifulislamudoy56@gmail.com',
    password: 'Shariful@24680'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.username === ADMIN_CREDENTIALS.username && 
        formData.password === ADMIN_CREDENTIALS.password) {
      
      // Generate token and set expiry (24 hours)
      const token = btoa(JSON.stringify({
        username: formData.username,
        timestamp: new Date().getTime()
      }));
      
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminTokenExpiry', expiry.toString());
      
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Code2 className="text-white" size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">Shariful Islam</h1>
              <p className="text-cyan-400 text-sm">Admin Panel</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6"
            >
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            Secure Admin Access • Portfolio Management
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
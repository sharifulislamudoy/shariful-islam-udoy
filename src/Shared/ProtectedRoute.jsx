// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('adminTokenExpiry');
      
      if (token && expiry && new Date().getTime() < parseInt(expiry)) {
        setIsAuthenticated(true);
      } else {
        // Clear expired token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
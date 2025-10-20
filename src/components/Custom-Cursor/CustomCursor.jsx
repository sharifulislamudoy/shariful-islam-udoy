import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const mouseEnter = () => setIsVisible(true);
    const mouseLeave = () => setIsVisible(false);
    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseenter', mouseEnter);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);

    // Enhanced hover detection
    const enhanceHoverEffects = () => {
      // Links
      document.querySelectorAll('a').forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('link'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      // Buttons
      document.querySelectorAll('button').forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('button'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      // Input fields
      document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('input'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      // Download button specifically
      const downloadBtn = document.querySelector('[class*="bg-gradient-to-r"][class*="from-blue-500"]');
      if (downloadBtn) {
        downloadBtn.addEventListener('mouseenter', () => setCursorVariant('download'));
        downloadBtn.addEventListener('mouseleave', () => setCursorVariant('default'));
      }

      // Chat elements
      document.querySelectorAll('.bg-gray-800.rounded-lg').forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('text'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      // Tech stack icons
      document.querySelectorAll('[class*="p-3"][class*="bg-gray-800"]').forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('tech'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };

    setTimeout(enhanceHoverEffects, 1000);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseenter', mouseEnter);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: isClicking ? 0.8 : 1,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '2px solid #3b82f6',
      mixBlendMode: 'difference',
    },
    link: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: isClicking ? 1.1 : 1.3,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '2px solid #3b82f6',
      mixBlendMode: 'difference',
    },
    button: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      scale: isClicking ? 1.4 : 1.6,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      border: '2px solid #2563eb',
      mixBlendMode: 'difference',
    },
    input: {
      x: mousePosition.x - 6,
      y: mousePosition.y - 6,
      scale: isClicking ? 0.9 : 1.1,
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      border: '2px solid #60a5fa',
      mixBlendMode: 'difference',
    },
    download: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: isClicking ? 1.8 : 2,
      backgroundColor: 'rgba(59, 130, 246, 0.4)',
      border: '3px solid #1d4ed8',
      mixBlendMode: 'difference',
    },
    text: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: isClicking ? 1 : 1.2,
      backgroundColor: 'rgba(59, 130, 246, 0.25)',
      border: '2px solid #3b82f6',
      mixBlendMode: 'difference',
    },
    tech: {
      x: mousePosition.x - 14,
      y: mousePosition.y - 14,
      scale: isClicking ? 1.2 : 1.4,
      backgroundColor: 'rgba(59, 130, 246, 0.35)',
      border: '2px solid #1e40af',
      mixBlendMode: 'difference',
    }
  };

  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 400,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
      
      {/* Cursor trail - Blue version */}
      <motion.div
        className="cursor-trail"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
          mass: 0.8
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Additional ring effect for download state */}
      {cursorVariant === 'download' && (
        <motion.div
          className="cursor-ring"
          animate={{
            x: mousePosition.x - 25,
            y: mousePosition.y - 25,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '50px',
            height: '50px',
            border: '2px solid #1d4ed8',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9997,
            opacity: isVisible ? 0.3 : 0,
          }}
        />
      )}

      {/* Pulse effect for tech icons */}
      {cursorVariant === 'tech' && (
        <motion.div
          className="tech-pulse"
          animate={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '40px',
            height: '40px',
            border: '2px solid #3b82f6',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9996,
            opacity: isVisible ? 0.2 : 0,
          }}
        />
      )}

      {/* Additional glow dot for better visibility */}
      <motion.div
        className="cursor-dot"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '4px',
          height: '4px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s ease',
        }}
      />

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        html, body, a, button, input, textarea, [role="button"] {
          cursor: none !important;
        }

        .custom-cursor {
          filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
          will-change: transform;
          backdrop-filter: blur(1px);
        }

        /* Custom glow effects for different states */
        .custom-cursor[style*="border: 2px solid rgb(59, 130, 246)"] {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        .custom-cursor[style*="border: 2px solid rgb(37, 99, 235)"] {
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
        }

        .custom-cursor[style*="border: 3px solid rgb(29, 78, 216)"] {
          box-shadow: 0 0 20px rgba(29, 78, 216, 0.6);
        }

        .custom-cursor[style*="border: 2px solid rgb(30, 64, 175)"] {
          box-shadow: 0 0 15px rgba(30, 64, 175, 0.5);
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
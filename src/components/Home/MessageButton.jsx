import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const MessageButton = () => {
    const openMessenger = () => {
        window.open('https://m.me/sharifulislamudoy56', '_blank');
    };

    return (
        <motion.button
            onClick={openMessenger}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/30 border-2 border-white/20"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        >
            <MessageCircle size={24} />
        </motion.button>
    );
};

export default MessageButton;
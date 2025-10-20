import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import {
    Mail,
    Phone,
    MessageCircle,
    Github,
    Linkedin,
    Facebook,
    Send,
    MapPin,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const Contact = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

    const contactLinks = [
        {
            platform: 'WhatsApp',
            icon: MessageCircle,
            link: 'https://wa.me/8801995322033',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/20',
            text: '+880 19953 22033'
        },
        {
            platform: 'GitHub',
            icon: Github,
            link: 'https://github.com/yourusername',
            color: 'from-gray-700 to-gray-900',
            bgColor: 'bg-gray-700/20',
            text: 'github.com/yourusername'
        },
        {
            platform: 'LinkedIn',
            icon: Linkedin,
            link: 'https://linkedin.com/in/yourprofile',
            color: 'from-blue-600 to-blue-800',
            bgColor: 'bg-blue-600/20',
            text: 'linkedin.com/in/yourprofile'
        },
        {
            platform: 'Facebook',
            icon: Facebook,
            link: 'https://facebook.com/yourprofile',
            color: 'from-blue-500 to-blue-700',
            bgColor: 'bg-blue-500/20',
            text: 'facebook.com/yourprofile'
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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Replace these with your actual EmailJS credentials
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_email: 'sharifulislamudoy56@gmail.com'
            };

            await emailjs.send(
                'service_g3v04mb',
                'template_jlvarab',
                templateParams,
                'zuZo7fy02LzGTazcc' 
            );

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
            
            // Reset status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.section
            id="contact"
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="min-h-screen py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900"
        >
            <div className="max-w-7xl mx-auto">
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
                            Get In Touch
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
                        className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto"
                    >
                        Let's work together! I'm always open to discussing new opportunities and creative projects.
                    </motion.p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side - Contact Links */}
                    <motion.div
                        variants={containerVariants}
                        className="lg:w-2/5 space-y-6"
                    >
                        <motion.h3
                            variants={itemVariants}
                            className="text-2xl font-bold text-white mb-6"
                        >
                            Connect With Me
                        </motion.h3>

                        {/* Contact Links */}
                        {contactLinks.map((link, index) => (
                            <motion.a
                                key={link.platform}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, x: 10 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-4 p-4 rounded-xl ${link.bgColor} border border-gray-700 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`p-3 rounded-lg bg-gradient-to-r ${link.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                >
                                    <link.icon className="text-white" size={24} />
                                </motion.div>
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold text-lg">{link.platform}</h4>
                                    <p className="text-gray-300 text-sm">{link.text}</p>
                                </div>
                            </motion.a>
                        ))}

                        {/* Direct Contact Info */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 space-y-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                            >
                                <Mail className="text-blue-400" size={20} />
                                <span>sharifulislamudoy56@gmail.com</span>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                            >
                                <Phone className="text-cyan-400" size={20} />
                                <span>+880 19953 22033</span>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20"
                            >
                                <MapPin className="text-gray-400" size={20} />
                                <span>Dhaka, Bangladesh</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Contact Form */}
                    <motion.div
                        variants={containerVariants}
                        className="lg:w-3/5"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Send Me a Message</h3>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-green-500/20 border border-green-500/50"
                                >
                                    <CheckCircle className="text-green-400" size={20} />
                                    <span className="text-green-400">Message sent successfully! I'll get back to you soon.</span>
                                </motion.div>
                            )}

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-500/20 border border-red-500/50"
                                >
                                    <AlertCircle className="text-red-400" size={20} />
                                    <span className="text-red-400">Failed to send message. Please try again.</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="name" className="block text-white mb-2 font-medium">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your name"
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="email" className="block text-white mb-2 font-medium">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your email"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="subject" className="block text-white mb-2 font-medium">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="What's this about?"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="message" className="block text-white mb-2 font-medium">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Tell me about your project or inquiry..."
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variants={itemVariants}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default Contact;
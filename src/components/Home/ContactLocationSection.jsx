import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import {
    MapPin,
    Navigation,
    Clock,
    Globe,
    Mail,
    Phone,
    MessageCircle,
    Github,
    Linkedin,
    Facebook,
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Target
} from 'lucide-react';

const ContactLocationSection = () => {
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

    const mapVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Location Information
    const locationInfo = {
        address: "Jurain, Dhaka, Bangladesh",
        coordinates: "23.691142, 90.440331",
        timezone: "GMT+6 (Bangladesh Standard Time)",
        availability: "Available for Remote Work Worldwide"
    };

    // Contact & Location Details
    const contactDetails = [
        { icon: Mail, label: "Email", value: "sharifulislamudoy56@gmail.com", link: "mailto:sharifulislamudoy56@gmail.com" },
        { icon: Phone, label: "Phone", value: "+880 19953 22033", link: "tel:+8801995322033" },
        { icon: Clock, label: "Working Hours", value: "10:00 AM - 7:00 PM (GMT+6)" },
        { icon: Globe, label: "Timezone", value: "Bangladesh Standard Time" }
    ];

    // Social Media & Contact Links
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
            link: 'https://github.com/sharifulislamudoy',
            color: 'from-gray-700 to-gray-900',
            bgColor: 'bg-gray-700/20',
            text: 'github.com/sharifulislamudoy'
        },
        {
            platform: 'LinkedIn',
            icon: Linkedin,
            link: 'https://linkedin.com/in/shariful-islam-udoy',
            color: 'from-blue-600 to-blue-800',
            bgColor: 'bg-blue-600/20',
            text: 'linkedin.com/in/shariful-islam-udoy'
        },
        {
            platform: 'Facebook',
            icon: Facebook,
            link: 'https://facebook.com/sharifulislamudoy56',
            color: 'from-blue-500 to-blue-700',
            bgColor: 'bg-blue-500/20',
            text: 'facebook.com/sharifulislamudoy56'
        }
    ];

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
            
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
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
                            Contact & Location
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
                        className="text-gray-300 mt-6 max-w-3xl mx-auto text-lg"
                    >
                        Based in Dhaka, Bangladesh — Available for remote collaboration worldwide. Let's connect and build something amazing together!
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left Column - Location & Map */}
                    <div className="space-y-8">
                        {/* Map Section */}
                        <motion.div
                            variants={mapVariants}
                            className="relative rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative h-[400px] md:h-[500px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d913.3938200827413!2d90.440331!3d23.691142!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9e7d89677bd%3A0x3b5c34ece56ca8e!2sJurain%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1765682475102!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                
                                <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.6 }}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            y: [0, -5, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="relative"
                                    >
                                        <div className="bg-blue-500 rounded-full p-4 shadow-2xl">
                                            <MapPin className="text-white" size={28} />
                                        </div>
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.5, 2],
                                                opacity: [0.7, 0.4, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeOut"
                                            }}
                                            className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                                        />
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.8 }}
                                    className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <Navigation size={16} />
                                        <span>Drag to navigate • Scroll to zoom</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Location Information */}
                        <motion.div
                            variants={containerVariants}
                            className="space-y-6"
                        >
                            {/* Location Card */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="bg-blue-500/20 p-3 rounded-xl">
                                        <MapPin className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            Current Location
                                        </h3>
                                        <p className="text-gray-300">
                                            {locationInfo.address}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Coordinates: {locationInfo.coordinates}
                                        </p>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.6 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full px-4 py-2 mt-2"
                                >
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-green-400 font-medium text-sm">
                                        {locationInfo.availability}
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* Contact Details */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">
                                    Direct Contact
                                </h3>
                                <div className="space-y-3">
                                    {contactDetails.map((detail, index) => (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
                                        >
                                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                                <detail.icon className="text-blue-400" size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-400 text-xs">{detail.label}</p>
                                                {detail.link ? (
                                                    <a
                                                        href={detail.link}
                                                        className="text-white hover:text-cyan-400 transition-colors duration-300 text-sm"
                                                    >
                                                        {detail.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-white text-sm">{detail.value}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column - Contact Form & Social Links */}
                    <div className="space-y-8">
                        {/* Contact Form */}
                        <motion.div
                            variants={containerVariants}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Send Me a Message</h3>

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="name" className="block text-white mb-2 font-medium text-sm">
                                            Your Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="email" className="block text-white mb-2 font-medium text-sm">
                                            Your Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="subject" className="block text-white mb-2 font-medium text-sm">
                                        Subject
                                    </label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="What's this about?"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="message" className="block text-white mb-2 font-medium text-sm">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="5"
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
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Social Media Links */}
                        <motion.div
                            variants={containerVariants}
                            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                Connect With Me
                            </h3>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                                {contactLinks.map((link, index) => (
                                    <motion.a
                                        key={link.platform}
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl ${link.bgColor} border border-gray-700 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`p-3 rounded-lg bg-gradient-to-r ${link.color} shadow-lg group-hover:shadow-xl transition-all duration-300 mb-2`}
                                        >
                                            <link.icon className="text-white" size={22} />
                                        </motion.div>
                                        <div className="text-center">
                                            <h4 className="text-white font-semibold text-sm">{link.platform}</h4>
                                            <p className="text-gray-300 text-xs mt-1 truncate w-full">{link.text}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Timezone Info */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <Clock className="text-cyan-400" size={22} />
                                <h4 className="text-lg font-bold text-white">Timezone Information</h4>
                            </div>
                            <p className="text-gray-300 mb-4 text-sm">
                                I work in Bangladesh Standard Time (GMT+6). Perfect for collaborating with clients in:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Asia', 'Europe', 'Australia', 'Middle East', 'North America'].map((region, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300"
                                    >
                                        {region}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    variants={itemVariants}
                    className="text-center pt-8 border-t border-gray-800"
                >
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Regardless of your location, I'm equipped to work with clients globally. 
                        Whether you're across the street or across the ocean, let's bridge the distance and build something amazing together!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="mailto:sharifulislamudoy56@gmail.com"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm md:text-base"
                        >
                            <Mail size={18} />
                            Start a Conversation
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="tel:+8801995322033"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 text-sm md:text-base"
                        >
                            <Phone size={18} />
                            Call Me Directly
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default ContactLocationSection;
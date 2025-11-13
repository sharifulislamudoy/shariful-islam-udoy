import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Database, Palette, Rocket, Send, User, Bot } from 'lucide-react';
import Groq from 'groq-sdk';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingId, setCurrentTypingId] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const heroRef = useRef(null);

  const roles = [
    "MERN Stack Developer",
    "Next.js Developer",
    "Full Stack Developer",
    "React.js Specialist"
  ];

  // Initialize Groq client
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Your information for the AI
  const developerInfo = {
    name: "Shariful Islam Udoy",
    role: "Full Stack Developer",
    skills: ["React.js", "Next.js", "Node.js", "MongoDB", "Express.js", "Redux Toolkit", "TypeScript", "Tailwind CSS"],
    experience: "2+ years",
    education: "BSc in Mathematics (Dhaka College)",
    location: "Bangladesh",
    email: "sharifulislamudoy56@gmail.com",
    phone: "+880 19953 22033",
    whatsapp: "https://wa.me/8801995322033",
    achievements: [
      {
        name: "Programming Hero Certificate",
        description: "Completed comprehensive web development course with excellent performance",
        certificateLink: "https://drive.google.com/file/d/1Qa7Xyx-lOn6JfPmG5EzlyTYj9kzz64z9/view?usp=drive_link",
        platform: "Programming Hero"
      },
      {
        name: "NSDA Certificate",
        description: "Achieved certification in software development and algorithms",
        certificateLink: "https://drive.google.com/file/d/1pOIytWLfQ7KZLyiXvhNYGexRU9GHNz8V/view?usp=drive_link",
        platform: "NSDA"
      },
      {
        name: "Recommendation Letter",
        description: "Strong recommendation letter from Programming Hero recognizing outstanding performance, dedication, and technical skills",
        certificateLink: "https://drive.google.com/file/d/1HK_2EhwGuGfiaNsKaC1twq-MVER1LW2v/view?usp=sharing",
        platform: "Programming Hero",
        type: "Recommendation Letter",
        details: {
          issuer: "Programming Hero",
          date: "2025",
          highlights: [
            "Outstanding performance in web development course",
            "Exceptional problem-solving skills",
            "Strong dedication and commitment",
            "Excellent technical capabilities",
            "Great potential for software development career"
          ]
        }
      }
    ],
    projects: [
      {
        name: "Mighty Striker",
        description: "A comprehensive cricket platform built with Next.js featuring live scores, player statistics, team management, and real-time updates",
        technologies: ["Next.js", "React", "Tailwind CSS", "JavaScript", "Vercel"],
        features: [
          "Live match scores and updates",
          "Player and team statistics",
          "Responsive design",
          "Fast performance optimized with Next.js",
          "Modern UI with Tailwind CSS"
        ],
        liveLink: "https://mighty-strikers.vercel.app/",
        githubLink: "https://github.com/sharifulislamudoy/mighty-strikers",
        detailsLink: "https://shariful-islam-udoy.vercel.app/projects/mighty-strikers",
        status: "Completed"
      },
      "Cricket Team Representative platform with MERN stack",
      "Real-time match update",
      "Player Ranking",
      "Player dashboard",
      "Mighty Strikers websites"
    ],
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    tools: ["Git", "Docker", "VS Code", "Postman", "Figma"],
    availability: "Available for freelance projects",
    hobbies: ["Coding", "Learning new technologies", "Open source contributions", "Football"],
    social: {
      github: "https://github.com/sharifulislamudoy",
      linkedin: "https://linkedin.com/in/shariful-islam-udoy",
      portfolio: "https://shariful-islam-udoy.vercel.app",
      facebook: "https://www.facebook.com/sharifulislamudoy56/",
      fiverr: "https://www.fiverr.com/sharifulislam_u"
    }
  };

  // Improved function to render text with clickable links and emails
  const renderTextWithEmailAndLinks = (text) => {
    if (!text) return null;

    // Regular expressions for different types of links
    const urlRegex = /(https?:\/\/[^\s]+[^\s.,)])(?=\s|$|[,.)])/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const certificateRegex = /(CERTIFICATE_LINK_[A-Z_]+)/g;
    const recommendationRegex = /(RECOMMENDATION_LINK)/g;

    // Split by both URLs and emails while preserving the delimiters
    const parts = text.split(/(https?:\/\/[^\s]+[^\s.,)])(?=\s|$|[,.)])|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)|(CERTIFICATE_LINK_[A-Z_]+)|(RECOMMENDATION_LINK)/gi);

    return parts.map((part, index) => {
      if (!part) return null;

      // Check if part is a URL
      if (part.match(urlRegex)) {
        const url = part.trim();
        // Extract platform name from URL for better display
        let platformName = 'Link';
        if (url.includes('github.com')) platformName = 'GitHub';
        else if (url.includes('linkedin.com')) platformName = 'LinkedIn';
        else if (url.includes('facebook.com')) platformName = 'Facebook';
        else if (url.includes('fiverr.com')) platformName = 'Fiverr';
        else if (url.includes('vercel.app') || url.includes('portfolio')) platformName = 'Portfolio';
        else if (url.includes('wa.me')) platformName = 'WhatsApp';
        else if (url.includes('mighty-strikers')) platformName = 'Mighty Strikers';
        else if (url.includes('drive.google.com')) platformName = 'Certificate';

        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium mx-1"
            onClick={(e) => e.stopPropagation()}
          >
            {platformName}
          </a>
        );
      }
      // Check if part is an email
      else if (part.match(emailRegex)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium mx-1"
            onClick={(e) => e.stopPropagation()}
          >
            Email
          </a>
        );
      }
      // Check if part is a certificate placeholder
      else if (part.match(certificateRegex)) {
        const certificateType = part.replace('CERTIFICATE_LINK_', '').toLowerCase();
        const achievement = developerInfo.achievements.find(a =>
          a.platform.toLowerCase().replace(' ', '_') === certificateType
        );

        if (achievement) {
          return (
            <a
              key={index}
              href={achievement.certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium mx-1"
              onClick={(e) => e.stopPropagation()}
            >
              {achievement.platform} Certificate
            </a>
          );
        }
      }
      // Check if part is a recommendation placeholder
      else if (part.match(recommendationRegex)) {
        const recommendation = developerInfo.achievements.find(a => a.type === "Recommendation Letter");
        if (recommendation) {
          return (
            <a
              key={index}
              href={recommendation.certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium mx-1"
              onClick={(e) => e.stopPropagation()}
            >
              Recommendation Letter
            </a>
          );
        }
      }
      // Regular text
      return part;
    });
  };

  // Function to simulate typing effect for bot messages
  const typeMessage = (message, messageId, callback) => {
    setIsTyping(true);
    setCurrentTypingId(messageId);
    setTypingMessage('');
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypingMessage(prev => prev + message.charAt(index));
        index++;

        // Scroll to bottom during typing
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setCurrentTypingId(null);
        if (callback) callback();
      }
    }, 20);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initial bot message - delayed start
  useEffect(() => {
    if (hasInitialized) return;

    const timer = setTimeout(() => {
      const initialMessage = `Hi! I'm Udoy's AI assistant. I can tell you about his skills, experience, projects, achievements, recommendation letter and more! What would you like to know about him?`;
      const initialMessageId = 1;

      typeMessage(initialMessage, initialMessageId, () => {
        setChatMessages([
          {
            id: initialMessageId,
            text: initialMessage,
            isBot: true,
            timestamp: new Date()
          }
        ]);
        setTypingMessage('');
        setHasInitialized(true);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasInitialized]);

  // Scroll to bottom of chat - ONLY within chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, typingMessage]);

  // Typing animation for roles
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
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Shariful_Islam_Udoy_Resume.pdf';
    link.click();
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: userInput,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // System prompt with your information including achievements and recommendation letter
      const systemPrompt = `You are an AI assistant for Shariful Islam Udoy (Udoy), a full stack developer. 
      
      IMPORTANT: Always respond as if you ARE Udoy's assistant. Use "I", "my", "me" when referring to Udoy's qualifications and experience.

      Here is Udoy's information:
      - Name: ${developerInfo.name}
      - Role: ${developerInfo.role}
      - Skills: ${developerInfo.skills.join(', ')}
      - Experience: ${developerInfo.experience}
      - Education: ${developerInfo.education}
      - Location: ${developerInfo.location}
      - Email: ${developerInfo.email}
      - Phone: ${developerInfo.phone}
      - WhatsApp: ${developerInfo.whatsapp}
      
      ACHIEVEMENTS & CERTIFICATIONS:
      ${developerInfo.achievements.map(achievement => {
        if (achievement.type === "Recommendation Letter") {
          return `- RECOMMENDATION LETTER: ${achievement.description}
          Issuer: ${achievement.details.issuer}
          Date: ${achievement.details.date}
          Highlights: ${achievement.details.highlights.join(', ')}
          Link: RECOMMENDATION_LINK`;
        }
        return `- ${achievement.platform}: ${achievement.description} - CERTIFICATE_LINK_${achievement.platform.toUpperCase().replace(' ', '_')}`;
      }).join('\n')}

      PROJECTS (Pay special attention to Mighty Strikers):
      ${developerInfo.projects.map(project => {
        if (typeof project === 'object' && project.name === "Mighty Striker") {
          return `- MIGHTY STRIKERS (Flagship Project): ${project.description}
          Technologies: ${project.technologies.join(', ')}
          Features: ${project.features.join(', ')}
          Live Demo: ${project.liveLink}
          GitHub: ${project.githubLink}
          Details: ${project.detailsLink}
          Status: ${project.status}`;
        }
        return `- ${project}`;
      }).join('\n')}

      - Programming Languages: ${developerInfo.languages.join(', ')}
      - Tools: ${developerInfo.tools.join(', ')}
      - Availability: ${developerInfo.availability}
      - Hobbies: ${developerInfo.hobbies.join(', ')}
      - Social Media:
        * GitHub: ${developerInfo.social.github}
        * LinkedIn: ${developerInfo.social.linkedin}
        * Facebook: ${developerInfo.social.facebook}
        * Fiverr: ${developerInfo.social.fiverr}
        * Portfolio: ${developerInfo.social.portfolio}

      IMPORTANT LINKS:
      - Mighty Strikers Live: ${developerInfo.projects[0].liveLink}
      - Mighty Strikers GitHub: ${developerInfo.projects[0].githubLink}
      - Mighty Strikers Details: ${developerInfo.projects[0].detailsLink}
      - Programming Hero Certificate: CERTIFICATE_LINK_PROGRAMMING_HERO
      - NSDA Certificate: CERTIFICATE_LINK_NSDA
      - Recommendation Letter: RECOMMENDATION_LINK

      RECOMMENDATION LETTER DETAILS:
      - I have a strong recommendation letter from Programming Hero
      - It recognizes my outstanding performance in their web development course
      - Highlights my exceptional problem-solving skills and dedication
      - Commends my technical capabilities and potential
      - Issued in 2025 by Programming Hero
      - You can view it at: RECOMMENDATION_LINK

      IMPORTANT FORMATTING INSTRUCTIONS:
      - When mentioning URLs or emails, ALWAYS include the full URL or email address in your response
      - For certificates, use the placeholder format: CERTIFICATE_LINK_PLATFORM_NAME
      - For recommendation letter, use: RECOMMENDATION_LINK
      - For Mighty Strikers project, always mention it's built with Next.js and include the live link
      - For GitHub, always include: ${developerInfo.social.github}
      - For LinkedIn, always include: ${developerInfo.social.linkedin}
      - For Facebook, always include: ${developerInfo.social.facebook}
      - For Fiverr, always include: ${developerInfo.social.fiverr}
      - For Portfolio, always include: ${developerInfo.social.portfolio}
      - For Email, always include: ${developerInfo.email}
      - For WhatsApp, always include: ${developerInfo.whatsapp}

      CRITICAL URL FORMATTING:
      - When including URLs in your response, make sure they are separated by spaces and don't include trailing commas or periods
      - Example: "You can find me on GitHub at ${developerInfo.social.github} and check my recommendation letter at RECOMMENDATION_LINK"
      - BAD: "Visit ${developerInfo.social.github}, and RECOMMENDATION_LINK."
      - GOOD: "Visit ${developerInfo.social.github} and RECOMMENDATION_LINK"

      Answer questions about Udoy professionally and helpfully. Keep responses concise but informative (2-4 sentences). 
      Be enthusiastic but professional. If asked about something not in the provided information, politely redirect to what you can discuss.

      When someone asks about achievements or certificates, mention:
      - Programming Hero certificate (CERTIFICATE_LINK_PROGRAMMING_HERO)
      - NSDA certificate (CERTIFICATE_LINK_NSDA)
      - Recommendation letter from Programming Hero (RECOMMENDATION_LINK)

      When someone asks specifically about recommendation letters or references, provide details about the Programming Hero recommendation letter.

      Example responses:
      - "I have completed the Programming Hero web development course and you can view my certificate at CERTIFICATE_LINK_PROGRAMMING_HERO and my recommendation letter at RECOMMENDATION_LINK"
      - "My achievements include completing the Programming Hero course CERTIFICATE_LINK_PROGRAMMING_HERO, NSDA certification CERTIFICATE_LINK_NSDA, and a strong recommendation letter from Programming Hero RECOMMENDATION_LINK"
      - "I have a recommendation letter from Programming Hero that highlights my outstanding performance, problem-solving skills, and technical capabilities. You can view it at RECOMMENDATION_LINK"
      - "I specialize in MERN stack development and have built several projects including Mighty Strikers, a cricket platform built with Next.js..."
      - "My experience includes 2+ years working with React and Node.js, and I recently built Mighty Strikers using Next.js..."
      - "I'm currently available for freelance projects and would love to discuss opportunities. Check out my Mighty Strikers project at ${developerInfo.projects[0].liveLink}"
      - "You can find me on GitHub at ${developerInfo.social.github} and see my Programming Hero certificate at CERTIFICATE_LINK_PROGRAMMING_HERO and recommendation letter at RECOMMENDATION_LINK"
      - "I studied at Dhaka College and completed my BSc in Mathematics there while building projects like Mighty Strikers and earning certifications from Programming Hero CERTIFICATE_LINK_PROGRAMMING_HERO and NSDA CERTIFICATE_LINK_NSDA, plus a recommendation letter RECOMMENDATION_LINK"`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userInput
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      });

      const botResponse = completion.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please check out my resume for more information!";
      const botMessageId = Date.now() + 1;

      typeMessage(botResponse, botMessageId, () => {
        const botMessage = {
          id: botMessageId,
          text: botResponse,
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
        setTypingMessage('');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error calling Groq API:', error);

      const errorResponse = "I'm sorry, I'm having trouble connecting right now. Please try again later or check out my resume for more information!";
      const errorMessageId = Date.now() + 1;

      typeMessage(errorResponse, errorMessageId, () => {
        const errorMessage = {
          id: errorMessageId,
          text: errorResponse,
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
        setTypingMessage('');
        setIsLoading(false);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick questions suggestions including achievements and recommendation
  const quickQuestions = [
    "What certificates do you have?",
    "Show me your achievements",
    "Do you have a recommendation letter?",
    "Are you available for work?",
    "What are your social media links?",
  ];

  const handleQuickQuestion = (question) => {
    setUserInput(question);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <motion.section
      id="home"
      ref={heroRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20"
    >
      <div className='flex flex-col lg:flex-row items-center w-11/12 mx-auto lg:px-13'>
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
            scalable and performant applications. Currently studying Mathematics at Dhaka College.
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

        {/* Right Side - Chatbot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:w-1/2 w-full max-w-2xl"
        >
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700 h-[500px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Bot className="text-green-400" size={20} />
              <div className="text-gray-200 text-sm font-semibold">Udoy's AI Assistant</div>
              <div className="ml-auto text-xs text-gray-400">Online</div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-gray-800
              [&::-webkit-scrollbar-thumb]:bg-gray-600
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
            >
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                    {message.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.isBot
                    ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                    <p className="text-sm leading-relaxed">
                      {message.isBot ? renderTextWithEmailAndLinks(message.text) : message.text}
                    </p>
                    <div className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-blue-200'
                      }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && typingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed text-gray-200">
                      {renderTextWithEmailAndLinks(typingMessage)}
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isLoading && !isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-tl-none p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions */}
            {chatMessages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 border-t border-gray-800">
                <div className="text-xs text-gray-400 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about my skills, experience, projects, certificates, recommendation letter..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading || isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || isTyping || !userInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
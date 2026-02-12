import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Database, Palette, Rocket, Send, User, Bot } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasGroqError, setHasGroqError] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const heroRef = useRef(null);

  const roles = [
    "MERN Stack Developer",
    "Next.js Developer",
    "Full Stack Developer",
    "React.js Specialist"
  ];

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Check for API key on component mount
  useEffect(() => {
    if (!GROQ_API_KEY) {
      console.warn('GROQ_API_KEY is missing. Chat functionality will be limited.');
      setHasGroqError(true);
      
      // Show initial message even without API key
      const timer = setTimeout(() => {
        const initialMessage = `Hi! I'm Udoy's assistant. The chat feature requires a GROQ API key to work fully. However, you can still learn about me through the quick questions below!`;
        const initialMessageId = 1;
        
        setTypingMessage('');
        setHasInitialized(true);
        setChatMessages([
          {
            id: initialMessageId,
            text: initialMessage,
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Initialize Groq client only if API key exists
  const getGroqClient = () => {
    if (!GROQ_API_KEY || hasGroqError) return null;
    
    try {
      const Groq = require('groq-sdk');
      return new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });
    } catch (error) {
      console.error('Failed to initialize Groq client:', error);
      setHasGroqError(true);
      return null;
    }
  };

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

  // Function to simulate typing effect for bot messages
  const typeMessage = (message, messageId, callback) => {
    setIsTyping(true);
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
    if (hasInitialized || hasGroqError) return;

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
  }, [hasInitialized, hasGroqError]);

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

    // If API key is missing, provide static responses
    if (!GROQ_API_KEY || hasGroqError) {
      setTimeout(() => {
        const staticResponses = getStaticResponse(userInput);
        const botMessageId = Date.now() + 1;
        
        typeMessage(staticResponses, botMessageId, () => {
          const botMessage = {
            id: botMessageId,
            text: staticResponses,
            isBot: true,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, botMessage]);
          setTypingMessage('');
          setIsLoading(false);
        });
      }, 500);
      return;
    }

    try {
      // Get Groq client
      const groq = getGroqClient();
      if (!groq) {
        throw new Error('Groq client not available');
      }

      // System prompt with your information
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
          Link: ${achievement.certificateLink}`;
        }
        return `- ${achievement.platform}: ${achievement.description} - ${achievement.certificateLink}`;
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

      Answer questions about Udoy professionally and helpfully. Keep responses concise but informative (2-4 sentences). 
      Be enthusiastic but professional. If asked about something not in the provided information, politely redirect to what you can discuss.`;

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

      const errorResponse = "I'm sorry, I'm having trouble connecting right now. Here's what I can tell you:\n\n" + getStaticResponse(userInput);
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
        setHasGroqError(true);
      });
    }
  };

  // Static responses for when API is not available
  const getStaticResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('certificate') || lowerQuestion.includes('achievement')) {
      return `I have several achievements:
      
      1. Programming Hero Certificate - Completed comprehensive web development course
      🔗 https://drive.google.com/file/d/1Qa7Xyx-lOn6JfPmG5EzlyTYj9kzz64z9/view?usp=drive_link
      
      2. NSDA Certificate - Certification in software development and algorithms
      🔗 https://drive.google.com/file/d/1pOIytWLfQ7KZLyiXvhNYGexRU9GHNz8V/view?usp=drive_link
      
      3. Recommendation Letter from Programming Hero - Recognizes my outstanding performance, dedication, and technical skills
      🔗 https://drive.google.com/file/d/1HK_2EhwGuGfiaNsKaC1twq-MVER1LW2v/view?usp=sharing`;
    }
    
    if (lowerQuestion.includes('recommendation')) {
      return `Yes! I have a strong recommendation letter from Programming Hero that highlights:
      • Outstanding performance in web development course
      • Exceptional problem-solving skills
      • Strong dedication and commitment
      • Excellent technical capabilities
      • Great potential for software development career
      
      You can view it here: https://drive.google.com/file/d/1HK_2EhwGuGfiaNsKaC1twq-MVER1LW2v/view?usp=sharing`;
    }
    
    if (lowerQuestion.includes('available') || lowerQuestion.includes('work')) {
      return `Yes, I'm currently available for freelance projects and full-time opportunities! I have 2+ years of experience with MERN stack and Next.js. You can reach me at:
      
      📧 Email: sharifulislamudoy56@gmail.com
      📱 WhatsApp: https://wa.me/8801995322033
      💼 Fiverr: https://www.fiverr.com/sharifulislam_u`;
    }
    
    if (lowerQuestion.includes('social') || lowerQuestion.includes('link')) {
      return `Here are my social media links:
      
      • GitHub: https://github.com/sharifulislamudoy
      • LinkedIn: https://linkedin.com/in/shariful-islam-udoy
      • Portfolio: https://shariful-islam-udoy.vercel.app
      • Facebook: https://www.facebook.com/sharifulislamudoy56/
      • Fiverr: https://www.fiverr.com/sharifulislam_u`;
    }
    
    if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology')) {
      return `I specialize in:
      • Frontend: React.js, Next.js, TypeScript, Tailwind CSS, Redux Toolkit
      • Backend: Node.js, Express.js, MongoDB
      • Languages: JavaScript, TypeScript, Python, Java
      • Tools: Git, Docker, VS Code, Postman, Figma
      
      Check out my Mighty Strikers project: https://mighty-strikers.vercel.app/`;
    }
    
    if (lowerQuestion.includes('project')) {
      return `My flagship project is Mighty Striker - a cricket platform built with Next.js:
      • Live scores and player statistics
      • Built with Next.js, React, Tailwind CSS
      • Live Demo: https://mighty-strikers.vercel.app/
      • GitHub: https://github.com/sharifulislamudoy/mighty-strikers
      
      I've also built other projects using MERN stack and various web technologies.`;
    }
    
    return `I'm Shariful Islam Udoy, a Full Stack Developer specializing in MERN stack and Next.js. I have 2+ years of experience, currently studying Mathematics at Dhaka College.
    
    Skills: React.js, Next.js, Node.js, MongoDB, Express.js
    Available for freelance work!
    
    Contact me:
    📧 sharifulislamudoy56@gmail.com
    📱 https://wa.me/8801995322033
    🌐 https://shariful-islam-udoy.vercel.app`;
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
    "Tell me about your skills",
    "What projects have you built?"
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
      <div className='flex flex-col lg:flex-row justify-between items-center  xl:mt-20 w-11/12 mx-auto lg:px-13'>
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
              <div className="ml-auto text-xs text-gray-400">
                {hasGroqError ? 'Limited Mode' : 'Online'}
              </div>
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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
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
                    <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                      {typingMessage}
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

              {/* API Key Missing Warning - Only show if no messages yet */}
              {!hasInitialized && !hasGroqError && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Initializing AI assistant...
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
                  placeholder="Ask about my skills, experience, projects, certificates..."
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
              {hasGroqError && (
                <div className="text-xs text-yellow-500 mt-2 text-center">
                  ⚠️ Using static responses. Add GROQ_API_KEY for full AI functionality.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
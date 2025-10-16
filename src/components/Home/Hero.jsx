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
  const chatEndRef = useRef(null);

  const roles = [
    "MERN Stack Developer",
    "Next.js Developer", 
    "Full Stack Developer",
    "React.js Specialist"
  ];

  // Initialize Groq client
  const groq = new Groq({
    apiKey: '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',
    dangerouslyAllowBrowser: true
  });

  // Your information for the AI
  const developerInfo = {
    name: "Shariful Islam Udoy",
    role: "Full Stack Developer",
    skills: ["React.js", "Next.js", "Node.js", "MongoDB", "Express.js", "Redux Toolkit", "TypeScript", "Tailwind CSS"],
    experience: "2+ years",
    education: "BSc in Mathematics",
    location: "Bangladesh",
    email: "sharifulislamudoy56@gmail.com",
    phone: "+880 19953 22033",
    projects: [
      "E-commerce platform with MERN stack",
      "Real-time chat application",
      "Project management dashboard",
      "Portfolio websites"
    ],
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    tools: ["Git", "Docker", "VS Code", "Postman", "Figma"],
    availability: "Available for freelance projects",
    hobbies: ["Coding", "Learning new technologies", "Open source contributions"],
    social: {
      github: "https://github.com/sharifulislamudoy",
      linkedin: "https://linkedin.com/in/sharifulislamudoy",
      portfolio: "https://yourportfolio.com", // Update with your actual portfolio
      facebook: "https://www.facebook.com/sharifulislamudoy56/"
    }
  };

  // Initial bot message
  useEffect(() => {
    setChatMessages([
      {
        id: 1,
        text: `Hi! I'm Udoy's AI assistant. I can tell you about his skills, experience, projects, and more! What would you like to know about him?`,
        isBot: true,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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
    if (!userInput.trim() || isLoading) return;

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
      - Projects: ${developerInfo.projects.join(', ')}
      - Programming Languages: ${developerInfo.languages.join(', ')}
      - Tools: ${developerInfo.tools.join(', ')}
      - Availability: ${developerInfo.availability}
      - Hobbies: ${developerInfo.hobbies.join(', ')}
      - Social Media:
        * GitHub: ${developerInfo.social.github}
        * LinkedIn: ${developerInfo.social.linkedin}
        * Facebook: ${developerInfo.social.facebook}
        * Portfolio: ${developerInfo.social.portfolio}

      Answer questions about Udoy professionally and helpfully. Keep responses concise but informative (2-4 sentences). 
      Be enthusiastic but professional. If asked about something not in the provided information, politely redirect to what you can discuss.

      Example responses:
      - "I specialize in MERN stack development and have built several projects including..."
      - "My experience includes 2+ years working with React and Node.js..."
      - "I'm currently available for freelance projects and would love to discuss opportunities..."
      - "You can find me on GitHub at ${developerInfo.social.github} and LinkedIn at ${developerInfo.social.linkedin}"`;

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

      const botMessage = {
        id: Date.now() + 1,
        text: completion.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please check out my resume for more information!",
        isBot: true,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or check out my resume for more information!",
        isBot: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick questions suggestions
  const quickQuestions = [
    "What are your skills?",
    "Tell me about your experience",
    "What projects have you worked on?",
    "Are you available for work?",
    "What are your social media links?"
  ];

  const handleQuickQuestion = (question) => {
    setUserInput(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      sendMessage();
    }, 100);
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

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex gap-6 mt-8"
        >
          {[
            { 
              name: "GitHub", 
              url: developerInfo.social.github, 
              color: "hover:text-white",
              icon: "🐱"
            },
            { 
              name: "LinkedIn", 
              url: developerInfo.social.linkedin, 
              color: "hover:text-blue-400",
              icon: "💼"
            },
            { 
              name: "Facebook", 
              url: developerInfo.social.facebook, 
              color: "hover:text-blue-500",
              icon: "👤"
            },
            { 
              name: "Portfolio", 
              url: developerInfo.social.portfolio, 
              color: "hover:text-cyan-400",
              icon: "🌐"
            }
          ].map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className={`text-gray-400 ${social.color} transition-colors flex items-center gap-2 text-sm font-medium`}
            >
              <span className="text-lg">{social.icon}</span>
              {social.name}
            </motion.a>
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
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <Bot className="text-green-400" size={20} />
            <div className="text-gray-200 text-sm font-semibold">Udoy's AI Assistant</div>
            <div className="ml-auto text-xs text-gray-400">Online</div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 
            /* Scrollbar Styling for Webkit Browsers */
            scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800
            /* Hide scrollbar for non-Webkit browsers */
            scrollbar-none
            /* Custom scrollbar hiding */
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-800
            [&::-webkit-scrollbar-thumb]:bg-gray-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {message.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.isBot 
                    ? 'bg-gray-800 text-gray-200 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-400' : 'text-blue-200'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
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
          {chatMessages.length <= 2 && (
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
                placeholder="Ask about my skills, experience, projects..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !userInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
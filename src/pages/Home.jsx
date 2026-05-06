import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Hero from '../components/Home/Hero';
import AboutMe from '../components/Home/AboutMe';

import Experience from '../components/Home/Experience';
import Projects from '../components/Home/Projects';
import Education from '../components/Home/Education';
import MessageButton from '../components/Home/MessageButton';
import Achievements from '../components/Home/Achievments';
import ContactLocationSection from '../components/Home/ContactLocationSection';
import SkillSection from '../components/Home/Skills';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-slate-50 mt-10">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingSpinner key="loading" />
        ) : (
          <>
            {/* Hero is sticky — stays fixed while About scrolls over it */}
            <div className="sticky top-0 z-0">
              <Hero key="hero" />
            </div>

            {/* About section slides up over Hero */}
            <div className="relative z-10">
              <AboutMe key="about" />
              <SkillSection key="skills" />
              <Projects key="projects" />
              <Experience key="experience" />
              <Education key="education" />
              <Achievements key="achievement" />
              <ContactLocationSection key="contact" />
            </div>

            <MessageButton />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Hero from '../components/Home/Hero';
import AboutMe from '../components/Home/AboutMe';
import Skills from '../components/Home/Skills';
import Experience from '../components/Home/Experience';
import Projects from '../components/Home/Projects';
import Education from '../components/Home/Education';



const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden bg-black text-slate-50 mt-10">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingSpinner key="loading" />
        ) : (
          <>
            <Hero key="hero" />
            <AboutMe key="about"/>
            <Skills key="skills" />
            <Projects key="projects" />
            <Experience key="experience" />
            <Education key="education" />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
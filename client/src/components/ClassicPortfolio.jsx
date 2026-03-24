import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from './Navbar';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import Achievements from './Achievements';
import Timeline from './Timeline';
import Contact from './Contact';
import GamesHub from './GamesHub';
import CursorGlow from './CursorGlow';
import ScrollProgress from './ScrollProgress';

const ClassicPortfolio = ({ onBackToMenu }) => {
  const [xp, setXp] = useState(0);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      const progress = scrolled / (total || 1);
      setXp(Math.round(progress * 7480));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <Navbar xp={xp} onPlayClick={() => setShowGame(true)} onBackToMenu={onBackToMenu} />

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Achievements />
        <Timeline />
        <Contact />
      </main>

      <AnimatePresence>
        {showGame && <GamesHub onClose={() => setShowGame(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ClassicPortfolio;

import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setWidth((scrolled / total) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
};

export default ScrollProgress;

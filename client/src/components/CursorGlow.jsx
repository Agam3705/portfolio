import { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animate = () => {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      animId = requestAnimationFrame(animate);
    };

    const addHover = () => outline.classList.add('hovered');
    const removeHover = () => outline.classList.remove('hovered');

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animate);

    document.querySelectorAll('a, button, .card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-outline" ref={outlineRef} />
    </>
  );
};

export default CursorGlow;

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundCanvas({ animations = true }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
      if (!animations) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raf = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [animations]);

  return (
    <motion.canvas
      ref={canvasRef}
      id="bg-canvas"
      className="absolute inset-0 w-full h-full z-[0] pointer-events-none opacity-80 transition-opacity duration-1000"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
}

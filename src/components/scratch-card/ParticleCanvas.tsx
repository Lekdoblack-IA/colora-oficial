import { useRef, useEffect } from 'react';
import { Particle } from '@/types/scratchCard';

interface ParticleCanvasProps {
  particles: Particle[];
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
  isScratching: boolean;
}

export const ParticleCanvas = ({ particles, setParticles, isScratching }: ParticleCanvasProps) => {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    if (!particleCanvas) return;

    const rect = particleCanvas.getBoundingClientRect();
    particleCanvas.width = rect.width * window.devicePixelRatio;
    particleCanvas.height = rect.height * window.devicePixelRatio;
    const ctx = particleCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      const particleCanvas = particleCanvasRef.current;
      if (!particleCanvas) return;
      
      const ctx = particleCanvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, particleCanvas.offsetWidth, particleCanvas.offsetHeight);

      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.05,
          }))
          .filter(particle => particle.life > 0);
      });

      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        const size = particle.size * alpha;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        
        const hue = 45 + Math.random() * 15;
        const saturation = 80 + Math.random() * 20;
        const lightness = 70 + Math.random() * 20;
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
        ctx.shadowBlur = 2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.length > 0 || isScratching) {
        animationRef.current = requestAnimationFrame(animateParticles);
      }
    };

    if (particles.length > 0 || isScratching) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, isScratching, setParticles]);

  return (
    <canvas 
      ref={particleCanvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

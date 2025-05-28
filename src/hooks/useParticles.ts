
import { useState, useCallback } from 'react';
import { Particle } from '@/types/scratchCard';

export const useParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    const particleCount = 1 + Math.random() * 2;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 20 + Math.random() * 10,
        maxLife: 20 + Math.random() * 10,
        size: 1 + Math.random() * 2,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  return {
    particles,
    setParticles,
    createParticles
  };
};

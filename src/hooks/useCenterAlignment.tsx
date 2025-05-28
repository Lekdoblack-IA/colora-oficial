
import { useEffect, useRef, useState } from 'react';

export const useCenterAlignment = () => {
  const [isInCenter, setIsInCenter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAlignment = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const screenCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      
      // Tolerância de 50px para considerar "no centro"
      const tolerance = 50;
      const isAligned = Math.abs(elementCenter - screenCenter) <= tolerance;
      
      setIsInCenter(isAligned);
    };

    const handleScroll = () => {
      requestAnimationFrame(checkAlignment);
    };

    checkAlignment(); // Check initial position
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkAlignment);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkAlignment);
    };
  }, []);

  return { ref, isInCenter };
};

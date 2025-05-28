
import { useEffect, useRef, useState } from 'react';

export const useCenterAlignment = () => {
  const [isInCenter, setIsInCenter] = useState(false);
  const [isInCenterWithDelay, setIsInCenterWithDelay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      
      if (isAligned) {
        // Se está no centro, ativa imediatamente e cancela qualquer timeout pendente
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsInCenterWithDelay(true);
      } else if (isInCenterWithDelay) {
        // Se saiu do centro mas ainda está com delay ativo, inicia o timeout de 2 segundos
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsInCenterWithDelay(false);
          timeoutRef.current = null;
        }, 2000);
      }
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInCenterWithDelay]);

  return { ref, isInCenter: isInCenterWithDelay };
};

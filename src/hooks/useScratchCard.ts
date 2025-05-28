
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseScratchCardProps {
  isLoggedIn: boolean;
  onAuthModalOpen?: () => void;
}

export const useScratchCard = ({ isLoggedIn, onAuthModalOpen }: UseScratchCardProps) => {
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const handleScratch = useCallback((percentage: number) => {
    setScratchPercentage(percentage);
    if (percentage > 60 && !showButton) {
      setShowButton(true);
    }
  }, [showButton]);

  const handleTransformClick = useCallback(() => {
    console.log('handleTransformClick called, isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('User is logged in, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('User not logged in, opening auth modal');
      if (onAuthModalOpen) {
        onAuthModalOpen();
      } else {
        console.error('onAuthModalOpen function not provided');
      }
    }
  }, [isLoggedIn, navigate, onAuthModalOpen]);

  return {
    isScratching,
    setIsScratching,
    scratchPercentage,
    showButton,
    handleScratch,
    handleTransformClick
  };
};

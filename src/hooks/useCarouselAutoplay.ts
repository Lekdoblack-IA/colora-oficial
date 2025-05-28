
import { useEffect } from 'react';

interface UseCarouselAutoplayProps {
  isAutoPlaying: boolean;
  currentIndex: number;
  totalImages: number;
  onNext: () => void;
  interval?: number;
}

export const useCarouselAutoplay = ({
  isAutoPlaying,
  currentIndex,
  totalImages,
  onNext,
  interval = 4000
}: UseCarouselAutoplayProps) => {
  useEffect(() => {
    if (!isAutoPlaying) return;

    const autoplayInterval = setInterval(() => {
      onNext();
    }, interval);

    return () => clearInterval(autoplayInterval);
  }, [isAutoPlaying, currentIndex, onNext, interval]);
};

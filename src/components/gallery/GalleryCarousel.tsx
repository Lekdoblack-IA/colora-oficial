import { useState } from 'react';
import { galleryImages } from '@/data/galleryImages';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { useTouchDrag } from '@/hooks/useTouchDrag';
import GalleryImage from './GalleryImage';
import GalleryControls from './GalleryControls';
import GalleryIndicators from './GalleryIndicators';

const GalleryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex;
    const totalImages = galleryImages.length;
    
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalImages / 2) {
      normalizedDiff = diff > 0 ? diff - totalImages : diff + totalImages;
    }
    
    return normalizedDiff;
  };

  const { touchHandlers, mouseHandlers } = useTouchDrag({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    threshold: 50,
  });

  useCarouselAutoplay({
    isAutoPlaying,
    currentIndex,
    totalImages: galleryImages.length,
    onNext: nextSlide,
  });

  return (
    <div 
      className="relative h-[500px] flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Desktop: 3D Carousel */}
      <div className="hidden md:block relative w-full h-full">
        {galleryImages.map((image, index) => {
          const position = getSlidePosition(index);
          
          return (
            <GalleryImage
              key={image.id}
              image={image}
              position={position}
              isMobile={false}
              onClick={() => goToSlide(index)}
            />
          );
        })}
      </div>

      {/* Mobile: Touch-enabled Carousel with Peek Effect */}
      <div 
        className="md:hidden relative w-full h-full flex items-center justify-center touch-pan-y px-8"
        {...touchHandlers}
        {...mouseHandlers}
        style={{ userSelect: 'none' }}
      >
        {galleryImages.map((image, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + galleryImages.length) % galleryImages.length;
          const isNext = index === (currentIndex + 1) % galleryImages.length;
          
          let position = 2; // far away
          if (isActive) position = 0;
          else if (isPrev) position = -1;
          else if (isNext) position = 1;
          
          return (
            <GalleryImage
              key={image.id}
              image={image}
              position={position}
              isMobile={true}
              onClick={() => goToSlide(index)}
            />
          );
        })}
      </div>

      {/* Controls - apenas no desktop */}
      <div className="hidden md:block">
        <GalleryControls onPrevious={prevSlide} onNext={nextSlide} />
      </div>
      
      <GalleryIndicators 
        totalImages={galleryImages.length}
        currentIndex={currentIndex}
        onIndicatorClick={goToSlide}
      />
    </div>
  );
};

export default GalleryCarousel;

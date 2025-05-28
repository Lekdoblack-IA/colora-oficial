
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    title: "Casal na Praia",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=320&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Família no Parque",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714ffe0d8?w=320&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Cachorro Fofo",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=320&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Momento Romântico",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=320&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Amigos Felizes",
    image: "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=320&h=400&fit=crop"
  }
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
    
    // Normalize the difference to handle circular navigation
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalImages / 2) {
      normalizedDiff = diff > 0 ? diff - totalImages : diff + totalImages;
    }
    
    return normalizedDiff;
  };

  const getSlideStyles = (position: number) => {
    const isActive = position === 0;
    const isPrev = position === -1;
    const isNext = position === 1;
    const isFarLeft = position < -1;
    const isFarRight = position > 1;

    let transform = '';
    let opacity = 0;
    let zIndex = 0;
    let scale = 0.8;

    if (isActive) {
      transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
      opacity = 1;
      zIndex = 3;
      scale = 1;
    } else if (isPrev) {
      transform = 'translateX(-120px) translateZ(-100px) rotateY(25deg)';
      opacity = 0.7;
      zIndex = 2;
      scale = 0.85;
    } else if (isNext) {
      transform = 'translateX(120px) translateZ(-100px) rotateY(-25deg)';
      opacity = 0.7;
      zIndex = 2;
      scale = 0.85;
    } else if (isFarLeft) {
      transform = 'translateX(-200px) translateZ(-200px) rotateY(45deg)';
      opacity = 0.3;
      zIndex = 1;
      scale = 0.7;
    } else if (isFarRight) {
      transform = 'translateX(200px) translateZ(-200px) rotateY(-45deg)';
      opacity = 0.3;
      zIndex = 1;
      scale = 0.7;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Criações da nossa{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              comunidade
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Veja como outros transformaram suas memórias em arte
          </p>
        </div>

        {/* Carrossel 3D */}
        <div 
          className="relative h-[500px] flex items-center justify-center overflow-hidden"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Desktop: Carrossel 3D com múltiplas imagens */}
          <div className="hidden md:block relative w-full h-full">
            {galleryImages.map((image, index) => {
              const position = getSlidePosition(index);
              const styles = getSlideStyles(position);
              
              return (
                <div
                  key={image.id}
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  style={{
                    ...styles,
                    transformOrigin: 'center center',
                    marginLeft: '-160px', // Half of image width (320px/2)
                    marginTop: '-200px',  // Half of image height (400px/2)
                  }}
                  onClick={() => goToSlide(index)}
                >
                  <div className="w-80 h-96 rounded-3xl bg-white border border-black overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '4/5' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Carrossel simplificado */}
          <div className="md:hidden relative w-full h-full flex items-center justify-center">
            {galleryImages.map((image, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + galleryImages.length) % galleryImages.length;
              const isNext = index === (currentIndex + 1) % galleryImages.length;
              
              let transform = 'translateX(400px)';
              let opacity = 0;
              let zIndex = 0;
              
              if (isActive) {
                transform = 'translateX(0px)';
                opacity = 1;
                zIndex = 3;
              } else if (isPrev) {
                transform = 'translateX(-300px) scale(0.8)';
                opacity = 0.4;
                zIndex = 1;
              } else if (isNext) {
                transform = 'translateX(300px) scale(0.8)';
                opacity = 0.4;
                zIndex = 1;
              }
              
              return (
                <div
                  key={image.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) ${transform}`,
                    opacity,
                    zIndex,
                    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <div className="w-72 h-96 rounded-3xl bg-white border border-black overflow-hidden shadow-xl">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '4/5' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controles */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 scale-125'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

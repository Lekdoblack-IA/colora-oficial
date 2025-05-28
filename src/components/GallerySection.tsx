
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
        setIsTransitioning(false);
      }, 150);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
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

        {/* Carrossel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Container principal */}
          <div className="flex items-center justify-center">
            {/* Desktop: 3 imagens com transição suave */}
            <div className="hidden md:flex items-center space-x-6 relative">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(${isTransitioning ? '-100px' : '0px'})`,
                  opacity: isTransitioning ? 0.3 : 1
                }}
              >
                {[-1, 0, 1].map((offset) => {
                  const index = (currentIndex + offset + galleryImages.length) % galleryImages.length;
                  const image = galleryImages[index];
                  const isActive = offset === 0;
                  
                  return (
                    <div
                      key={`${image.id}-${offset}`}
                      className={`transition-all duration-700 ease-out ${
                        isActive 
                          ? 'scale-100 opacity-100 z-10' 
                          : 'scale-90 opacity-60 blur-sm'
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      {/* Proporção 4:5 (320x400) */}
                      <div className="w-80 h-96 rounded-3xl bg-white border border-black overflow-hidden cursor-pointer hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
            </div>

            {/* Mobile: 1 imagem com peek e transição suave */}
            <div className="md:hidden relative w-full max-w-sm mx-auto">
              <div 
                className="flex items-center justify-center transition-all duration-700 ease-in-out"
                style={{
                  transform: `translateX(${isTransitioning ? '20px' : '0px'})`,
                  opacity: isTransitioning ? 0.5 : 1
                }}
              >
                {/* Imagem anterior (peek) */}
                <div className="absolute left-0 w-16 h-80 rounded-l-3xl bg-white border border-black overflow-hidden opacity-50 blur-sm -z-10">
                  <img
                    src={galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length].image}
                    alt="Anterior"
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '4/5' }}
                  />
                </div>

                {/* Imagem principal - Proporção 4:5 */}
                <div className="w-72 h-96 rounded-3xl bg-white border border-black overflow-hidden shadow-lg">
                  <img
                    src={galleryImages[currentIndex].image}
                    alt={galleryImages[currentIndex].title}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '4/5' }}
                  />
                </div>

                {/* Imagem próxima (peek) */}
                <div className="absolute right-0 w-16 h-80 rounded-r-3xl bg-white border border-black overflow-hidden opacity-50 blur-sm -z-10">
                  <img
                    src={galleryImages[(currentIndex + 1) % galleryImages.length].image}
                    alt="Próxima"
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '4/5' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center space-x-2 mt-8">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
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

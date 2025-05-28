
import GalleryCarousel from './GalleryCarousel';

const GallerySection = () => {
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

        <GalleryCarousel />
      </div>
    </section>
  );
};

export default GallerySection;

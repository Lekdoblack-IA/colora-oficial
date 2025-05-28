

interface GalleryIndicatorsProps {
  totalImages: number;
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
}

const GalleryIndicators = ({ totalImages, currentIndex, onIndicatorClick }: GalleryIndicatorsProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      {Array.from({ length: totalImages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-500 ${
            index === currentIndex
              ? 'bg-gradient-to-r from-pink-500 to-red-500 scale-125'
              : 'bg-gray-300/60 backdrop-blur-sm border border-white/30 hover:bg-gray-300/80 hover:backdrop-blur-md shadow-lg'
          }`}
        />
      ))}
    </div>
  );
};

export default GalleryIndicators;


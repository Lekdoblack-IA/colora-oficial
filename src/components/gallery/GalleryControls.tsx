
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

const GalleryControls = ({ onPrevious, onNext }: GalleryControlsProps) => {
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};

export default GalleryControls;

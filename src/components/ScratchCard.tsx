
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScratchCanvas } from './scratch-card/ScratchCanvas';
import { ParticleCanvas } from './scratch-card/ParticleCanvas';
import { TransformButton } from './scratch-card/TransformButton';
import { useParticles } from '@/hooks/useParticles';
import { useScratchCard } from '@/hooks/useScratchCard';
import { ScratchCardProps } from '@/types/scratchCard';

const ScratchCard = ({ isLoggedIn = false, onAuthModalOpen }: ScratchCardProps) => {
  const { particles, setParticles, createParticles } = useParticles();
  const {
    isScratching,
    setIsScratching,
    showButton,
    handleScratch,
    handleTransformClick
  } = useScratchCard({ isLoggedIn, onAuthModalOpen });

  return (
    <div className="w-full max-w-sm mx-auto">
      <AspectRatio ratio={4 / 5}>
        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-transparent hover:-translate-y-1">
          {/* Imagem de baixo - desenho para colorir */}
          <div 
            className="absolute inset-0 bg-white bg-cover bg-center" 
            style={{
              backgroundImage: "url('/lovable-uploads/281ee0c9-3370-4346-a604-231d215ef59f.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }} 
          />
          
          {/* Canvas de raspagem com a foto colorida */}
          <ScratchCanvas 
            onScratch={handleScratch}
            isScratching={isScratching}
            setIsScratching={setIsScratching}
            onCreateParticles={createParticles}
          />

          {/* Canvas de partículas */}
          <ParticleCanvas 
            particles={particles}
            setParticles={setParticles}
            isScratching={isScratching}
          />

          {/* Botão flutuante */}
          <TransformButton 
            isVisible={showButton}
            isLoggedIn={isLoggedIn}
            onTransformClick={handleTransformClick}
          />
        </div>
      </AspectRatio>
    </div>
  );
};

export default ScratchCard;

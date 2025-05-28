
import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from 'react-router-dom';
import { ScratchCanvas } from './scratch-card/ScratchCanvas';
import { ParticleCanvas } from './scratch-card/ParticleCanvas';
import { TransformButton } from './scratch-card/TransformButton';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface ScratchCardProps {
  isLoggedIn?: boolean;
  onAuthModalOpen?: () => void;
}

const ScratchCard = ({ isLoggedIn = false, onAuthModalOpen }: ScratchCardProps) => {
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const navigate = useNavigate();

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const particleCount = 1 + Math.random() * 2;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 20 + Math.random() * 10,
        maxLife: 20 + Math.random() * 10,
        size: 1 + Math.random() * 2,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleScratch = (percentage: number) => {
    setScratchPercentage(percentage);
    if (percentage > 60 && !showButton) {
      setShowButton(true);
    }
  };

  const handleTransformClick = () => {
    console.log('handleTransformClick called, isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('User is logged in, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('User not logged in, opening auth modal');
      if (onAuthModalOpen) {
        onAuthModalOpen();
      }
    }
  };

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

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from 'react-router-dom';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Criar uma imagem para a cobertura
    const img = new Image();
    img.onload = () => {
      // Calcular dimensões para manter proporção da imagem
      const imgAspect = img.width / img.height;
      const canvasAspect = rect.width / rect.height;
      let drawWidth, drawHeight, drawX, drawY;
      if (imgAspect > canvasAspect) {
        // Imagem é mais larga - ajustar pela altura
        drawHeight = rect.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (rect.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // Imagem é mais alta - ajustar pela largura
        drawWidth = rect.width;
        drawHeight = drawWidth / imgAspect;
        drawX = 0;
        drawY = (rect.height - drawHeight) / 2;
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Adicionar overlay escuro nas bordas se necessário
      if (drawX > 0) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, drawX, rect.height);
        ctx.fillRect(drawX + drawWidth, 0, drawX, rect.height);
      }
      if (drawY > 0) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, rect.width, drawY);
        ctx.fillRect(0, drawY + drawHeight, rect.width, drawY);
      }

      // Adicionar texto sobre a imagem
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, rect.height - 40, rect.width, 40);
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.min(rect.width * 0.04, 16);
      ctx.font = `bold ${fontSize}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillText('Raspe para ver a mágica', rect.width / 2, rect.height - 15);
    };
    img.src = '/lovable-uploads/955a3ce1-0cb0-4025-88e3-e2fca7f934dc.png';
  }, []);

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    if (!particleCanvas) return;

    const rect = particleCanvas.getBoundingClientRect();
    particleCanvas.width = rect.width * window.devicePixelRatio;
    particleCanvas.height = rect.height * window.devicePixelRatio;
    const ctx = particleCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      const particleCanvas = particleCanvasRef.current;
      if (!particleCanvas) return;
      
      const ctx = particleCanvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, particleCanvas.offsetWidth, particleCanvas.offsetHeight);

      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.05, // reduced gravity for lighter effect
          }))
          .filter(particle => particle.life > 0);
      });

      // Draw particles with golden glitter effect
      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        const size = particle.size * alpha;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8; // more subtle opacity
        
        // Golden glitter colors
        const hue = 45 + Math.random() * 15; // golden range
        const saturation = 80 + Math.random() * 20;
        const lightness = 70 + Math.random() * 20;
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Subtle glow effect
        ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
        ctx.shadowBlur = 2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.length > 0 || isScratching) {
        animationRef.current = requestAnimationFrame(animateParticles);
      }
    };

    if (particles.length > 0 || isScratching) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, isScratching]);

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const particleCount = 1 + Math.random() * 2; // reduced from 3-6 to 1-3 particles

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 10, // reduced spread
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2, // reduced velocity
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 20 + Math.random() * 10, // shorter life for better performance
        maxLife: 20 + Math.random() * 10,
        size: 1 + Math.random() * 2, // smaller particles
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0,
      y: 0
    };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    scratch(e);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const {
      x,
      y
    } = getEventPosition(e);

    // Create particles at scratch position with reduced frequency
    if (Math.random() < 0.3) { // only create particles 30% of the time for better performance
      createParticles(x, y);
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Tamanho do pincel responsivo para mobile
    const brushSize = Math.min(canvas.offsetWidth * 0.08, 30);
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();

    // Calcular porcentagem riscada
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        transparentPixels++;
      }
    }
    const percentage = transparentPixels / (imageData.data.length / 4) * 100;
    setScratchPercentage(percentage);
    if (percentage > 60 && !showButton) {
      setShowButton(true);
    }
  };

  const endScratch = () => {
    setIsScratching(false);
  };

  const handleTransformClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      onAuthModalOpen?.();
    }
  };

  return <div className="w-full max-w-sm mx-auto">
      <AspectRatio ratio={4 / 5}>
        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-transparent hover:-translate-y-1">
          {/* Imagem de baixo - desenho para colorir */}
          <div className="absolute inset-0 bg-white bg-cover bg-center" style={{
          backgroundImage: "url('/lovable-uploads/281ee0c9-3370-4346-a604-231d215ef59f.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
          
          {/* Canvas de raspagem com a foto colorida */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scratch-canvas touch-none" onMouseDown={startScratch} onMouseMove={scratch} onMouseUp={endScratch} onMouseLeave={endScratch} onTouchStart={startScratch} onTouchMove={scratch} onTouchEnd={endScratch} style={{
          touchAction: 'none'
        }} />

          {/* Canvas de partículas */}
          <canvas 
            ref={particleCanvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          />

          {/* Botão flutuante */}
          {showButton && <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up p-6" style={{ zIndex: 20 }}>
              <Button 
                onClick={handleTransformClick}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full shadow-lg animate-pulse-heart"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Transforme agora ✨</span>
              </Button>
            </div>}
        </div>
      </AspectRatio>
    </div>;
};

export default ScratchCard;

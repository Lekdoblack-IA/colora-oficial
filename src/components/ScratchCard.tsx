
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

const ScratchCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparkleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const animationFrameRef = useRef<number>();
  const sparkleIdRef = useRef(0);

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

  // Configurar canvas de faíscas
  useEffect(() => {
    const sparkleCanvas = sparkleCanvasRef.current;
    if (!sparkleCanvas) return;

    const rect = sparkleCanvas.getBoundingClientRect();
    sparkleCanvas.width = rect.width * window.devicePixelRatio;
    sparkleCanvas.height = rect.height * window.devicePixelRatio;
    const ctx = sparkleCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  // Animar faíscas
  useEffect(() => {
    const animateSparkles = () => {
      setSparkles(prevSparkles => {
        const newSparkles = prevSparkles
          .map(sparkle => ({
            ...sparkle,
            x: sparkle.x + sparkle.velocity.x,
            y: sparkle.y + sparkle.velocity.y,
            life: sparkle.life - 1,
            opacity: sparkle.life / sparkle.maxLife
          }))
          .filter(sparkle => sparkle.life > 0);

        return newSparkles;
      });

      // Desenhar faíscas
      const sparkleCanvas = sparkleCanvasRef.current;
      if (sparkleCanvas) {
        const ctx = sparkleCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, sparkleCanvas.offsetWidth, sparkleCanvas.offsetHeight);
          
          sparkles.forEach(sparkle => {
            ctx.save();
            ctx.globalAlpha = sparkle.opacity;
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 10;
            
            // Desenhar estrela
            const spikes = 4;
            const outerRadius = sparkle.size;
            const innerRadius = sparkle.size * 0.4;
            
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes;
              const x = sparkle.x + Math.cos(angle) * radius;
              const y = sparkle.y + Math.sin(angle) * radius;
              
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateSparkles);
    };

    animationFrameRef.current = requestAnimationFrame(animateSparkles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sparkles]);

  const createSparkles = (x: number, y: number) => {
    const newSparkles: Sparkle[] = [];
    const sparkleCount = Math.random() * 3 + 2; // 2-5 faíscas

    for (let i = 0; i < sparkleCount; i++) {
      newSparkles.push({
        id: sparkleIdRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 4 + 2,
        opacity: 1,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        },
        life: 30,
        maxLife: 30
      });
    }

    setSparkles(prev => [...prev, ...newSparkles]);
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

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

    const { x, y } = getEventPosition(e);

    // Criar faíscas na posição do cursor
    createSparkles(x, y);

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
    const percentage = (transparentPixels / (imageData.data.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 60 && !showButton) {
      setShowButton(true);
    }
  };

  const endScratch = () => {
    setIsScratching(false);
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
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full scratch-canvas touch-none"
            onMouseDown={startScratch}
            onMouseMove={scratch}
            onMouseUp={endScratch}
            onMouseLeave={endScratch}
            onTouchStart={startScratch}
            onTouchMove={scratch}
            onTouchEnd={endScratch}
            style={{ touchAction: 'none' }}
          />

          {/* Canvas de faíscas */}
          <canvas
            ref={sparkleCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          />

          {/* Botão flutuante */}
          {showButton && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up p-6" style={{ zIndex: 20 }}>
              <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full shadow-lg animate-pulse-heart">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Transforme agora ✨</span>
              </Button>
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
};

export default ScratchCard;

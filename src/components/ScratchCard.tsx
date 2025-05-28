import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ScratchCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showButton, setShowButton] = useState(false);

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
      <AspectRatio ratio={4/5}>
        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-transparent hover:-translate-y-3 hover:shadow-pink-500/20 transform hover:scale-[1.02] animate-float">
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

          {/* Botão flutuante */}
          {showButton && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up p-4">
              <Button 
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full shadow-lg animate-pulse-heart"
              >
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


import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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

    // Criar gradiente para a sobreposição
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Adicionar texto
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Raspe para ver a mágica', rect.width / 2, rect.height / 2);
  }, []);

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    setIsScratching(true);
    scratch(e);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
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
    <div className="relative w-full h-96 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-transparent hover:-translate-y-1">
      {/* Imagem de baixo - desenho */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces')"
        }}
      />
      
      {/* Canvas de raspagem */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full scratch-canvas"
        onMouseDown={startScratch}
        onMouseMove={scratch}
        onMouseUp={endScratch}
        onMouseLeave={endScratch}
        onTouchStart={startScratch}
        onTouchMove={scratch}
        onTouchEnd={endScratch}
      />

      {/* Botão flutuante */}
      {showButton && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up">
          <Button 
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-3 rounded-full shadow-lg animate-pulse-heart"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Transforme sua foto agora ✨
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;


import { useRef, useEffect } from 'react';

interface ScratchCanvasProps {
  onScratch: (percentage: number) => void;
  isScratching: boolean;
  setIsScratching: (scratching: boolean) => void;
  onCreateParticles: (x: number, y: number) => void;
}

export const ScratchCanvas = ({ 
  onScratch, 
  isScratching, 
  setIsScratching, 
  onCreateParticles 
}: ScratchCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        drawHeight = rect.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (rect.width - drawWidth) / 2;
        drawY = 0;
      } else {
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

    // Create particles at scratch position with reduced frequency
    if (Math.random() < 0.3) {
      onCreateParticles(x, y);
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
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
    onScratch(percentage);
  };

  const endScratch = () => {
    setIsScratching(false);
  };

  return (
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
  );
};

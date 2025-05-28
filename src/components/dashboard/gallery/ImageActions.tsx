
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageActionsProps {
  imageId: string;
  imageUrl: string;
  isUnlocked: boolean;
  expired: boolean;
  isConfirming: boolean;
  onUnlockClick: () => void;
}

export const ImageActions = ({ 
  imageId, 
  imageUrl, 
  isUnlocked, 
  expired, 
  isConfirming, 
  onUnlockClick 
}: ImageActionsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `colora-desenho-${imageId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "Sua imagem está sendo baixada."
    });
  };

  if (expired) {
    return null;
  }

  return (
    <div className="space-y-2">
      {!isUnlocked ? (
        <Button 
          onClick={onUnlockClick} 
          className={`w-full min-h-[44px] transition-all duration-500 ease-in-out transform ${
            isConfirming 
              ? 'bg-orange-500 hover:bg-orange-600 scale-105 shadow-lg' 
              : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-102 shadow-md'
          }`}
          size="sm"
        >
          <Download className={`w-4 h-4 mr-2 transition-transform duration-300 ${isConfirming ? 'animate-pulse' : ''}`} />
          <span className="transition-all duration-300 ease-in-out">
            {isConfirming ? 'Tem certeza? (-1 Crédito)' : 'Desbloquear'}
          </span>
        </Button>
      ) : (
        <Button 
          onClick={handleDownload} 
          className="w-full bg-green-600 hover:bg-green-700 min-h-[44px] transition-all duration-300 hover:scale-102 hover:shadow-lg" 
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      )}
    </div>
  );
};

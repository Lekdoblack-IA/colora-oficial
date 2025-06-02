
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
  originalUrl?: string;
}

export const ImageActions = ({ 
  imageId, 
  imageUrl, 
  isUnlocked, 
  expired, 
  isConfirming, 
  onUnlockClick,
  originalUrl
}: ImageActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      toast({
        title: "Preparando download",
        description: "Aguarde enquanto preparamos sua imagem..."
      });
      
      // Usar a URL original (sem parâmetros de cache) para download
      const downloadUrl = originalUrl || imageUrl.split('?')[0]; // Remove parâmetros se não tiver originalUrl
      
      console.log(`Baixando imagem ID: ${imageId}, URL: ${downloadUrl}`);
      
      // Fazer fetch da imagem
      const response = await fetch(downloadUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao baixar imagem: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('A imagem baixada está vazia');
      }
      
      // Criar URL do blob e fazer download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `colora-desenho-${imageId}.png`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "Sua imagem está sendo baixada."
      });
    } catch (error) {
      console.error('Erro ao fazer download da imagem:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a imagem. Tente novamente.",
        variant: "destructive"
      });
    }
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

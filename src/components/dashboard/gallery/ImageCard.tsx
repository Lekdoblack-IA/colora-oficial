import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageOverlay } from './ImageOverlay';
import { ImageActions } from './ImageActions';
import { TimeLeft } from './TimeLeft';
import { useState, useEffect } from 'react';
import { UserImage } from '@/hooks/useUserGallery';

// Interface UserImage importada de @/hooks/useUserGallery

interface ImageCardProps {
  image: UserImage;
  isExpired: boolean;
  isConfirming: boolean;
  onUnlockClick: () => void;
  onDeleteImage: () => void;
}

export const ImageCard = ({ 
  image, 
  isExpired, 
  isConfirming, 
  onUnlockClick, 
  onDeleteImage 
}: ImageCardProps) => {
  const isLocked = !image.unlocked && !isExpired;
  const [imageUrl, setImageUrl] = useState<string>(image.url || '');
  const [imageError, setImageError] = useState(false);
  
  // Inicializar a URL da imagem quando o componente é montado ou quando a imagem muda
  useEffect(() => {
    // Usar diretamente a URL da imagem sem modificar
    console.log(`Usando URL para imagem ${image.id}:`, image.url);
    
    // Atualizar o estado com a URL
    setImageUrl(image.url);
    setImageError(false); // Resetar o estado de erro
    
    // Pré-carregar a imagem com a URL
    const preloadImage = new Image();
    preloadImage.src = image.url;
    
    preloadImage.onload = () => {
      console.log(`Imagem ID: ${image.id} pré-carregada com sucesso`);
    };
    
    preloadImage.onerror = (error) => {
      console.error(`Erro ao pré-carregar imagem ID: ${image.id}:`, error);
      setImageError(true);
      
      // Tentar URL alternativa se a principal falhar
      if (image.originalUrl) {
        console.log(`Tentando URL original para imagem ${image.id}:`, image.originalUrl);
        setImageUrl(image.originalUrl);
      }
    };
  }, [image.id, image.url, image.originalUrl]); // Depender do ID, URL e URL original
  
  // Tratamento de erro de carregamento
  useEffect(() => {
    // Se houver erro ao carregar a imagem, tentar uma URL alternativa
    if (imageError) {
      console.log(`Erro ao carregar imagem ID: ${image.id}, tentando URL alternativa`);
      
      try {
        // Verificar se temos o nome do arquivo nos metadados
        const fileName = image.metadata?.filename;
        
        if (fileName) {
          // Construir URL alternativa diretamente do storage
          // Importante: Usar o ID da imagem para manter a URL estável
          const imageId = image.id;
          const alternativeUrl = `https://hyhtfzoqjwywzrtdboyq.supabase.co/storage/v1/object/public/user-gallery/${fileName}?id=${imageId}`;
          
          console.log(`Tentando URL alternativa para imagem ${image.id}:`, alternativeUrl);
          setImageUrl(alternativeUrl);
          
          // Pré-carregar a imagem alternativa
          const preloadAltImage = new Image();
          preloadAltImage.src = alternativeUrl;
          preloadAltImage.onload = () => console.log(`Imagem alternativa ID: ${image.id} carregada com sucesso`);
        } else {
          // Se não temos o nome do arquivo, tentar extrair da URL original
          const urlParts = image.originalUrl?.split('/') || [];
          const fileNameFromUrl = urlParts[urlParts.length - 1]?.split('?')[0]; // Remover parâmetros
          
          if (fileNameFromUrl) {
            // Usar o ID da imagem como identificador único e estável
            const imageId = image.id;
            const alternativeUrl = `https://hyhtfzoqjwywzrtdboyq.supabase.co/storage/v1/object/public/user-gallery/${fileNameFromUrl}?id=${imageId}`;
            
            console.log(`Tentando URL alternativa (do path) para imagem ${image.id}:`, alternativeUrl);
            setImageUrl(alternativeUrl);
          }
        }
      } catch (e) {
        console.error(`Erro ao processar URL alternativa da imagem ${image.id}:`, e);
      }
    }
  }, [imageError, image.id, image.originalUrl, image.metadata]);

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <AspectRatio ratio={4 / 5}>
          <img 
            src={imageUrl} 
            alt="Desenho transformado" 
            className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'filter blur-[16px]' : ''}`}
            onError={() => {
              console.log('Erro ao carregar imagem:', imageUrl);
              setImageError(true);
            }}
          />
          
          <ImageOverlay 
            isLocked={isLocked}
            expired={isExpired}
            onDeleteImage={onDeleteImage}
          />
        </AspectRatio>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="text-xs md:text-sm text-gray-600">
            {new Date(image.createdAt).toLocaleDateString('pt-BR')}
          </div>
          {image.expiresAt && !image.unlocked && !isExpired && (
            <TimeLeft expiresAt={image.expiresAt} />
          )}
        </div>

        <ImageActions
          imageId={image.id}
          imageUrl={imageUrl}
          originalUrl={image.metadata?.raw_url || image.originalUrl}
          isUnlocked={image.unlocked}
          expired={isExpired}
          isConfirming={isConfirming}
          onUnlockClick={onUnlockClick}
        />
      </div>
    </div>
  );
};

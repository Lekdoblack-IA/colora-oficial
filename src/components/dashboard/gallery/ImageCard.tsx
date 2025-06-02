
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageOverlay } from './ImageOverlay';
import { ImageActions } from './ImageActions';
import { TimeLeft } from './TimeLeft';
import { useState, useEffect } from 'react';
import { UserImage } from '@/hooks/useUserGallery';

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
  
  // Usar diretamente a URL com ID único
  useEffect(() => {
    console.log(`Carregando imagem ID: ${image.id} com URL: ${image.url}`);
    
    // Usar diretamente a URL que já contém o ID único
    setImageUrl(image.url);
    setImageError(false);
    
    // Pré-carregar a imagem
    const preloadImage = new Image();
    preloadImage.src = image.url;
    
    preloadImage.onload = () => {
      console.log(`Imagem ID: ${image.id} carregada com sucesso`);
    };
    
    preloadImage.onerror = (error) => {
      console.error(`Erro ao carregar imagem ID: ${image.id}:`, error);
      setImageError(true);
    };
  }, [image.id, image.url]);

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <AspectRatio ratio={4 / 5}>
          <img 
            src={imageUrl} 
            alt="Desenho transformado" 
            className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'filter blur-[16px]' : ''}`}
            onError={() => {
              console.log(`Erro ao exibir imagem ID: ${image.id}, URL: ${imageUrl}`);
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
          originalUrl={image.originalUrl}
          isUnlocked={image.unlocked}
          expired={isExpired}
          isConfirming={isConfirming}
          onUnlockClick={onUnlockClick}
        />
      </div>
    </div>
  );
};

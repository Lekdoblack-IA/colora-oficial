
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageOverlay } from './ImageOverlay';
import { ImageActions } from './ImageActions';
import { TimeLeft } from './TimeLeft';

interface UserImage {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  isUnlocked: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

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
  const isLocked = !image.isUnlocked && !isExpired;

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <AspectRatio ratio={4 / 5}>
          <img 
            src={image.transformedUrl} 
            alt="Desenho transformado" 
            className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'filter blur-[2px]' : ''}`} 
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
            {image.createdAt.toLocaleDateString('pt-BR')}
          </div>
          {image.expiresAt && !image.isUnlocked && !isExpired && (
            <TimeLeft expiresAt={image.expiresAt} />
          )}
        </div>

        <ImageActions
          imageId={image.id}
          imageUrl={image.transformedUrl}
          isUnlocked={image.isUnlocked}
          expired={isExpired}
          isConfirming={isConfirming}
          onUnlockClick={onUnlockClick}
        />
      </div>
    </div>
  );
};

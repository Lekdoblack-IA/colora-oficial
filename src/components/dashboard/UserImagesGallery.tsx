
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageCard } from './gallery/ImageCard';

interface UserImage {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  isUnlocked: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

interface UserImagesGalleryProps {
  images: UserImage[];
  onUnlockImage: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
  isImageExpired: (image: UserImage) => boolean;
}

export const UserImagesGallery = ({
  images,
  onUnlockImage,
  onDeleteImage,
  isImageExpired
}: UserImagesGalleryProps) => {
  const [confirmingUnlock, setConfirmingUnlock] = useState<string | null>(null);

  const handleUnlockClick = (imageId: string) => {
    if (confirmingUnlock === imageId) {
      onUnlockImage(imageId);
      setConfirmingUnlock(null);
    } else {
      setConfirmingUnlock(imageId);
      
      setTimeout(() => {
        setConfirmingUnlock(prev => prev === imageId ? null : prev);
      }, 5000);
    }
  };

  if (images.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 cursor-help">
                  Suas Imagens
                </h2>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gaste 1 Crédito para Desbloquear imagem pra Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="py-8 md:py-12">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Download className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Você ainda não transformou nenhuma imagem.
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Use a seção acima para começar!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
      <div className="text-center mb-6 md:mb-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 cursor-help">
                Suas Imagens
              </h2>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gaste 1 Crédito para Desbloquear imagem pra Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-sm md:text-base text-gray-600">
          {images.length} {images.length === 1 ? 'imagem transformada' : 'imagens transformadas'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map(image => {
          const expired = isImageExpired(image);
          const isConfirming = confirmingUnlock === image.id;
          
          return (
            <ImageCard
              key={image.id}
              image={image}
              isExpired={expired}
              isConfirming={isConfirming}
              onUnlockClick={() => handleUnlockClick(image.id)}
              onDeleteImage={() => onDeleteImage(image.id)}
            />
          );
        })}
      </div>
    </section>
  );
};

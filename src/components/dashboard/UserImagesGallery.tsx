import { useState, useEffect } from 'react';
import { Lock, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';

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
  isImageExpired: (image: UserImage) => boolean;
}
const TimeLeft = ({
  expiresAt
}: {
  expiresAt: Date;
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const difference = expiry - now;
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
        const seconds = Math.floor(difference % (1000 * 60) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expirada');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);
  return <div className="flex items-center space-x-1 text-xs text-red-600">
      <Clock className="w-3 h-3" />
      <span>Expira em {timeLeft}</span>
    </div>;
};
export const UserImagesGallery = ({
  images,
  onUnlockImage,
  isImageExpired
}: UserImagesGalleryProps) => {
  const {
    toast
  } = useToast();
  const handleDownload = (imageUrl: string, imageId: string) => {
    // Simular download
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
  if (images.length === 0) {
    return <section className="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Suas Imagens
          </h2>
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
      </section>;
  }
  return <section className="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Suas Imagens
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          {images.length} {images.length === 1 ? 'imagem transformada' : 'imagens transformadas'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map(image => {
        const expired = isImageExpired(image);
        const isLocked = !image.isUnlocked && !expired;
        return <div key={image.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <AspectRatio ratio={4/5}>
                  <img src={image.transformedUrl} alt="Desenho transformado" className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'filter blur-[2px]' : ''}`} />
                  
                  {/* Overlay para imagens bloqueadas */}
                  {isLocked && <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                        <p className="font-medium text-sm md:text-base">Bloqueada</p>
                        <p className="text-xs md:text-sm opacity-90">Use créditos para liberar</p>
                      </div>
                    </div>}

                  {/* Overlay para imagens expiradas */}
                  {expired && <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                        <p className="font-medium text-sm md:text-base">Expirada</p>
                        <p className="text-xs md:text-sm opacity-90">Esta imagem não está mais disponível</p>
                      </div>
                    </div>}
                </AspectRatio>
              </div>

              {/* Informações da imagem */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="text-xs md:text-sm text-gray-600">
                    {image.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                  {image.expiresAt && !image.isUnlocked && !expired && <TimeLeft expiresAt={image.expiresAt} />}
                </div>

                {/* Botões de ação */}
                {!expired && <div className="space-y-2">
                    {!image.isUnlocked ? <Button onClick={() => onUnlockImage(image.id)} className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 min-h-[44px]" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Desbloquear
                      </Button> : <Button onClick={() => handleDownload(image.transformedUrl, image.id)} className="w-full bg-green-600 hover:bg-green-700 min-h-[44px]" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>}
                  </div>}
              </div>
            </div>;
      })}
      </div>
    </section>;
};

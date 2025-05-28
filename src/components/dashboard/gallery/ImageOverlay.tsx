
import { Lock, Clock, Trash } from 'lucide-react';

interface ImageOverlayProps {
  isLocked: boolean;
  expired: boolean;
  onDeleteImage: () => void;
}

export const ImageOverlay = ({ isLocked, expired, onDeleteImage }: ImageOverlayProps) => {
  if (isLocked) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="text-center text-white rounded-xl px-[12px] py-[14px] bg-black/[0.38]">
          <Lock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
          <p className="font-medium text-sm md:text-base">Bloqueada</p>
          <p className="text-xs md:text-sm opacity-90">Use créditos para liberar</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
        <div className="text-center text-white">
          <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
          <p className="font-medium text-sm md:text-base">Expirada</p>
          <p className="text-xs md:text-sm opacity-90">Esta imagem não está mais disponível</p>
        </div>
        
        <button
          onClick={onDeleteImage}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors shadow-lg"
          title="Excluir imagem expirada"
        >
          <Trash className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return null;
};


import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  previewUrl: string;
  fileName: string;
  onCancel: () => void;
  onTransform: () => void;
}

export const ImagePreview = ({ 
  previewUrl, 
  fileName, 
  onCancel, 
  onTransform 
}: ImagePreviewProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="max-w-full md:max-w-md mx-auto rounded-lg shadow-md max-h-64 md:max-h-80 object-contain"
        />
        <p className="text-xs md:text-sm text-gray-600 mt-2">
          {fileName}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center justify-center space-x-2 min-h-[44px]"
        >
          <X className="w-4 h-4" />
          <span>Cancelar</span>
        </Button>
        <Button 
          onClick={onTransform}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 flex items-center justify-center space-x-2 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Transformar Imagem</span>
        </Button>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { Upload, X, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TransformImageSectionProps {
  onImageTransformed: (originalUrl: string, transformedUrl: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  canTransform: boolean;
}

const processingMessages = [
  "Preparando sua imagem com cuidado...",
  "Removendo distrações do fundo...",
  "Detectando formas, rostos e detalhes...",
  "Extraindo contornos com toque artístico...",
  "Aplicando o estilo de linha Colora...",
  "Afinando traços e curvas com precisão...",
  "Equilibrando luz, sombra e espaços vazios...",
  "Gerando textura suave como papel...",
  "Compactando em alta qualidade pra impressão...",
  "Sua arte está pronta pra colorir."
];

export const TransformImageSection = ({ 
  onImageTransformed, 
  isProcessing, 
  setIsProcessing,
  canTransform 
}: TransformImageSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.size > 15 * 1024 * 1024) { // 15MB
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 15MB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.includes('image/')) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos JPG e PNG são aceitos.",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleTransform = async () => {
    if (!selectedImage || !previewUrl) return;

    setIsProcessing(true);
    setCurrentMessageIndex(0);

    // Simular progresso das mensagens
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev >= processingMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    // Simular processamento
    setTimeout(() => {
      clearInterval(messageInterval);
      
      // Simular URL da imagem transformada
      const transformedUrl = "/lovable-uploads/8b435186-61a8-4d54-a916-c037e2abd2f6.png";
      
      onImageTransformed(previewUrl, transformedUrl);
      setIsProcessing(false);
      handleCancel();
      
      toast({
        title: "Sua imagem está pronta!",
        description: "Sua imagem foi adicionada à galeria! Redirecionando automaticamente...",
      });
    }, processingMessages.length * 2500);
  };

  if (!canTransform) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Transformar Nova Imagem
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 font-medium">
              Limite de imagens atingido
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Você pode ter no máximo 2 imagens não pagas simultaneamente. 
              Desbloqueie uma imagem existente para continuar.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isProcessing) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 mx-auto text-pink-500 animate-pulse" />
          </div>
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-900 min-h-[28px] transition-opacity duration-500">
              {processingMessages[currentMessageIndex]}
            </p>
            <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentMessageIndex + 1) / processingMessages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Transformar Nova Imagem
        </h2>
      </div>

      {!selectedImage ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-pink-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Selecione uma imagem
          </p>
          <p className="text-gray-600 mb-4">
            Arraste e solte ou clique para selecionar
          </p>
          <p className="text-sm text-gray-500">
            Formatos aceitos: JPG, PNG (até 15MB)
          </p>
          <input 
            id="file-input"
            type="file" 
            accept="image/jpeg,image/png" 
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <img 
              src={previewUrl!} 
              alt="Preview" 
              className="max-w-md mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-2">
              {selectedImage.name}
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </Button>
            <Button 
              onClick={handleTransform}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Transformar Imagem</span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

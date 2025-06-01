
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { sendImageToN8N } from '@/utils/n8nWebhook';

const processingMessages = [
  "Enviando sua imagem para processamento...",
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

export const useImageTransform = (
  onImageTransformed: () => void,
  isProcessing: boolean,
  setIsProcessing: (processing: boolean) => void
) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

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

    // Start the message progression
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev >= processingMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    try {
      // Send image to N8N for processing
      const webhookSuccess = await sendImageToN8N({
        imageFile: selectedImage,
        userId: user?.id,
        fileName: selectedImage.name,
        createdAt: new Date().toISOString()
      });

      if (webhookSuccess) {
        // Show success message after processing animation
        setTimeout(() => {
          clearInterval(messageInterval);
          setIsProcessing(false);
          handleCancel();
          
          onImageTransformed();
        }, processingMessages.length * 2000);
      } else {
        clearInterval(messageInterval);
        setIsProcessing(false);
        
        toast({
          title: "Erro no processamento",
          description: "Houve um problema ao processar sua imagem. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
      clearInterval(messageInterval);
      setIsProcessing(false);
      
      toast({
        title: "Erro no processamento",
        description: "Houve um problema ao processar sua imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedImage,
    previewUrl,
    currentMessageIndex,
    processingMessages,
    handleFileSelect,
    handleCancel,
    handleTransform
  };
};


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
  "Finalizando os últimos detalhes...",
  "Processamento quase concluído...",
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
    console.log('Arquivo selecionado:', file.name, file.size, file.type);
    
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
    console.log('Preview URL criada:', url);
  };

  const handleCancel = () => {
    console.log('Cancelando seleção de imagem');
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleTransform = async () => {
    if (!selectedImage || !previewUrl) {
      console.error('Nenhuma imagem selecionada para transformar');
      toast({
        title: "Erro",
        description: "Nenhuma imagem selecionada.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      console.error('Usuário não autenticado');
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para transformar imagens.",
        variant: "destructive"
      });
      return;
    }

    console.log('Iniciando transformação da imagem:', selectedImage.name);
    setIsProcessing(true);
    setCurrentMessageIndex(0);

    // Start the message progression with slower timing for longer processing
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = prev + 1;
        console.log('Progresso da mensagem:', nextIndex, '/', processingMessages.length);
        if (nextIndex >= processingMessages.length - 1) {
          clearInterval(messageInterval);
          return processingMessages.length - 1;
        }
        return nextIndex;
      });
    }, 3000); // Increased from 2000 to 3000ms for longer total time

    try {
      console.log('Enviando imagem para N8N...');
      
      // Send image to N8N for processing
      const webhookSuccess = await sendImageToN8N({
        imageFile: selectedImage,
        userId: user.id,
        fileName: selectedImage.name,
        createdAt: new Date().toISOString()
      });

      console.log('Resultado do webhook N8N:', webhookSuccess);

      if (webhookSuccess) {
        // Wait longer for processing - let the messages complete plus additional time
        const totalProcessingTime = processingMessages.length * 3000; // 39 seconds total
        const additionalWaitTime = 20000; // Additional 20 seconds for N8N processing
        const totalWaitTime = Math.max(totalProcessingTime, additionalWaitTime);
        
        console.log(`Aguardando processamento completo por ${totalWaitTime}ms`);
        
        setTimeout(() => {
          console.log('Finalizando processamento com sucesso');
          clearInterval(messageInterval);
          setIsProcessing(false);
          handleCancel();
          
          toast({
            title: "Imagem processada com sucesso!",
            description: "Sua imagem foi transformada e aparecerá na galeria em instantes.",
          });
          
          // Call the callback to refresh the gallery
          onImageTransformed();
          
          // Also trigger a delayed refresh to ensure we get the new image
          setTimeout(() => {
            console.log('Executando refresh adicional da galeria');
            onImageTransformed();
          }, 5000);
          
        }, totalWaitTime);
      } else {
        console.error('Falha no envio para N8N');
        clearInterval(messageInterval);
        setIsProcessing(false);
        
        toast({
          title: "Erro no processamento",
          description: "Houve um problema ao processar sua imagem. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no processamento da imagem:', error);
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

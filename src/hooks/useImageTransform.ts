
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

    // Gerar um ID único para esta transformação para rastreamento
    const transformId = `transform_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    console.log(`ID de transformação: ${transformId}`);

    // Progresso das mensagens mais lento para dar tempo do processamento real
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = prev + 1;
        console.log(`[${transformId}] Progresso da mensagem:`, nextIndex, '/', processingMessages.length);
        
        // Manter a última mensagem por mais tempo
        if (nextIndex >= processingMessages.length - 1) {
          // Não limpar o intervalo, apenas manter a última mensagem
          return processingMessages.length - 1;
        }
        return nextIndex;
      });
    }, 4000); // Aumentado para 4 segundos para dar mais tempo ao processamento real

    try {
      console.log(`[${transformId}] Enviando imagem para N8N...`);
      
      // Enviar imagem para processamento no N8N
      const webhookSuccess = await sendImageToN8N({
        imageFile: selectedImage,
        userId: user.id,
        fileName: selectedImage.name,
        createdAt: new Date().toISOString()
      });

      console.log(`[${transformId}] Resultado do webhook N8N:`, webhookSuccess);

      if (webhookSuccess) {
        // Tempo mínimo de processamento para mostrar as mensagens
        const minProcessingTime = processingMessages.length * 4000; // ~52 segundos
        
        // Tempo adicional para garantir que a imagem seja processada pelo N8N
        const additionalWaitTime = 30000; // 30 segundos adicionais
        
        // Tempo total de espera (mínimo 60 segundos)
        const totalWaitTime = Math.max(minProcessingTime, additionalWaitTime, 60000);
        
        console.log(`[${transformId}] Aguardando processamento completo por ${totalWaitTime/1000} segundos`);
        
        // Primeiro timeout - após o tempo mínimo, verificar se a imagem já está disponível
        setTimeout(() => {
          console.log(`[${transformId}] Finalizando fase inicial de processamento`);
          
          // Não finalizar o processamento ainda, apenas notificar o usuário
          toast({
            title: "Processamento em andamento",
            description: "Sua imagem está sendo finalizada e aparecerá na galeria em instantes.",
          });
          
          // Chamar o callback para atualizar a galeria e verificar se a imagem já está disponível
          onImageTransformed();
          
          // Continuar verificando a cada 10 segundos até um tempo máximo
          let checkCount = 0;
          const maxChecks = 6; // Máximo de 6 verificações adicionais (60 segundos)
          
          const checkInterval = setInterval(() => {
            checkCount++;
            console.log(`[${transformId}] Verificando disponibilidade da imagem: tentativa ${checkCount}/${maxChecks}`);
            
            // Atualizar a galeria novamente
            onImageTransformed();
            
            // Se atingimos o número máximo de verificações, finalizar o processamento
            if (checkCount >= maxChecks) {
              console.log(`[${transformId}] Tempo máximo de verificação atingido, finalizando processamento`);
              clearInterval(checkInterval);
              clearInterval(messageInterval);
              setIsProcessing(false);
              handleCancel();
              
              toast({
                title: "Processamento concluído",
                description: "Sua imagem foi processada e deve estar disponível na galeria.",
              });
            }
          }, 10000); // Verificar a cada 10 segundos
          
        }, totalWaitTime);
      } else {
        console.error(`[${transformId}] Falha no envio para N8N`);
        clearInterval(messageInterval);
        setIsProcessing(false);
        
        toast({
          title: "Erro no processamento",
          description: "Houve um problema ao processar sua imagem. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`[${transformId}] Erro no processamento da imagem:`, error);
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

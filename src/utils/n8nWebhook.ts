
import { useToast } from '@/hooks/use-toast';

interface SendImageToN8NParams {
  imageFile: File;
  userId?: string;
  fileName?: string;
  createdAt?: string;
}

export const sendImageToN8N = async ({
  imageFile,
  userId,
  fileName,
  createdAt
}: SendImageToN8NParams): Promise<boolean> => {
  try {
    const formData = new FormData();
    
    // Campo obrigatório: imagem como arquivo binário
    formData.append('image', imageFile);
    
    // Campos opcionais
    if (userId) {
      formData.append('user_id', userId);
    }
    
    if (fileName) {
      formData.append('file_name', fileName);
    }
    
    if (createdAt) {
      formData.append('created_at', createdAt);
    }

    console.log('Enviando imagem para N8N:', {
      fileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      userId,
      fileName,
      createdAt
    });

    const response = await fetch('https://n8n.srv845529.hstgr.cloud/webhook-test/receber-imagem', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Imagem enviada com sucesso para N8N:', response.status);
    return true;
  } catch (error) {
    console.error('Erro ao enviar imagem para N8N:', error);
    return false;
  }
};

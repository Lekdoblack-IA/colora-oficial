
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
    console.log('Preparando envio para N8N...');
    
    const formData = new FormData();
    
    // Gerar um nome de arquivo único baseado no timestamp e nome original
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8); // Gera um ID aleatório
    const originalName = fileName || imageFile.name;
    const fileExt = originalName.split('.').pop() || 'png';
    const uniqueFileName = `image_${timestamp}_${uniqueId}.${fileExt}`;
    
    console.log('Nome de arquivo único gerado:', uniqueFileName);
    
    // Campo obrigatório: imagem como arquivo binário
    formData.append('image', imageFile);
    
    // Campos opcionais
    if (userId) {
      formData.append('user_id', userId);
    }
    
    // Sempre usar o nome de arquivo único
    formData.append('file_name', uniqueFileName);
    
    if (createdAt) {
      formData.append('created_at', createdAt);
    }
    
    // Adicionar metadados adicionais para rastreabilidade
    formData.append('original_file_name', originalName);
    formData.append('generated_at', timestamp.toString());

    console.log('Enviando imagem para N8N:', {
      originalFileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      userId,
      fileName,
      createdAt
    });

    const response = await fetch('https://n8n.srv845529.hstgr.cloud/webhook/receber-imagem', {
      method: 'POST',
      body: formData,
    });

    console.log('Resposta do N8N - Status:', response.status);
    console.log('Resposta do N8N - Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Sem detalhes do erro');
      console.error('Erro HTTP do N8N:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text().catch(() => '');
    console.log('Resposta do N8N - Body:', responseText);
    
    console.log('Imagem enviada com sucesso para N8N');
    return true;
  } catch (error) {
    console.error('Erro detalhado ao enviar imagem para N8N:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return false;
  }
};

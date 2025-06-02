
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para sincronizar imagens do Storage com a tabela gallery_images
 * Este hook verifica se existem imagens no bucket user-gallery que não estão
 * registradas na tabela gallery_images e cria os registros necessários.
 */
export const useSyncGalleryImages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const syncImages = async () => {
      try {
        console.log('Iniciando sincronização de imagens do Storage com o banco de dados');
        let newImagesAdded = false;
        
        // 1. Buscar todas as imagens do usuário no Storage
        const { data: storageImages, error: storageError } = await supabase
          .storage
          .from('user-gallery')
          .list();

        if (storageError) {
          console.error('Erro ao buscar imagens do Storage:', storageError);
          return;
        }

        if (!storageImages || storageImages.length === 0) {
          console.log('Nenhuma imagem encontrada no Storage');
          return;
        }

        console.log(`Encontradas ${storageImages.length} imagens no Storage`);

        // 2. Buscar registros existentes na tabela gallery_images - incluir filename
        const { data: dbImages, error: dbError } = await supabase
          .from('gallery_images')
          .select('image_url, filename')
          .eq('user_id', user.id)
          .eq('deleted_by_system', false);

        if (dbError) {
          console.error('Erro ao buscar imagens do banco de dados:', dbError);
          return;
        }

        // 3. Filtrar imagens que começam com "coloring_" ou "image_" e não estão na tabela
        const coloringImages = storageImages.filter(img => 
          (img.name.startsWith('coloring_') || img.name.startsWith('image_')) && 
          (img.name.endsWith('.png') || img.name.endsWith('.jpg') || img.name.endsWith('.jpeg'))
        );

        console.log(`Encontradas ${coloringImages.length} imagens para sincronizar no Storage`);
        // Log detalhado de todas as imagens encontradas
        coloringImages.forEach(img => {
          console.log(`Imagem no storage: ${img.name}, tamanho: ${img.metadata?.size || 'N/A'}`);
        });

        // Mapear nomes de arquivos já existentes na tabela para evitar duplicação
        const existingFileNames = new Set();
        const existingImageUrls = new Set();
        
        dbImages?.forEach(img => {
          // Extrair nome do arquivo da URL ou do campo filename
          if (img.image_url) {
            // Armazenar a URL completa para comparação exata
            existingImageUrls.add(img.image_url);
            
            // Extrair e armazenar apenas o nome do arquivo (sem parâmetros)
            const urlParts = img.image_url.split('/');
            const fileNameWithParams = urlParts[urlParts.length - 1];
            const fileName = fileNameWithParams.split('?')[0]; // Remover parâmetros
            existingFileNames.add(fileName);
          }
          
          // Adicionar também pelo campo filename
          if (img.filename) {
            existingFileNames.add(img.filename);
          }
        });
        
        console.log('Nomes de arquivos existentes:', Array.from(existingFileNames));
        console.log('URLs de imagens existentes:', Array.from(existingImageUrls));

        // 4. Para cada imagem de colorir, verificar se já existe na tabela
        for (const img of coloringImages) {
          // CORREÇÃO PRINCIPAL: Gerar um filename único para cada imagem
          // Mesmo que venha com o mesmo nome do N8N, vamos torná-lo único
          const originalFileName = img.name;
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const fileExtension = originalFileName.split('.').pop();
          const baseFileName = originalFileName.split('.')[0];
          
          // Criar um filename único combinando múltiplos fatores
          const uniqueFileName = `${baseFileName}_${timestamp}_${randomSuffix}.${fileExtension}`;
          
          console.log(`Processando: ${originalFileName} -> ${uniqueFileName}`);
          
          // Construir URL pública usando o nome original do arquivo no Storage
          const imageUrl = supabase.storage.from('user-gallery').getPublicUrl(originalFileName).data.publicUrl;
          
          // Verificar se já existe pelo nome original OU pela URL
          const existsByOriginalName = existingFileNames.has(originalFileName);
          const existsByUrl = existingImageUrls.has(imageUrl);
          const exists = existsByOriginalName || existsByUrl;
          
          console.log(`Verificando imagem ${originalFileName}: existsByName=${existsByOriginalName}, existsByUrl=${existsByUrl}`);
          
          if (!exists) {
            console.log(`Sincronizando imagem ${originalFileName} com filename único: ${uniqueFileName}`);
            
            try {
              // Gerar um ID único para a imagem
              const uniqueId = `${timestamp}_${randomSuffix}`;
              
              // Inserir a imagem na tabela gallery_images com filename único
              const { data, error } = await supabase
                .from('gallery_images')
                .insert([
                  {
                    user_id: user?.id,
                    image_url: imageUrl, // URL baseada no nome original do arquivo no Storage
                    filename: uniqueFileName, // Nome único gerado para evitar conflitos
                    model_version: 'v1',
                    created_at: new Date().toISOString(),
                    unlocked: false,
                    // Definir data de expiração para 7 dias a partir de agora
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    // Adicionar metadados para ajudar a identificar a imagem
                    metadata: {
                      filename: uniqueFileName, // Nome único gerado
                      original_filename: originalFileName, // Nome original do Storage
                      raw_url: imageUrl,
                      cache_key: timestamp.toString(),
                      generatedAt: timestamp,
                      uniqueId: uniqueId,
                      sync_timestamp: timestamp,
                      url: imageUrl
                    }
                  }
                ]);

              if (error) {
                console.error('Erro ao inserir imagem na tabela:', error);
              } else {
                console.log('Imagem sincronizada com sucesso:', data);
                // Forçar invalidação do cache para atualizar a galeria
                await queryClient.invalidateQueries({ queryKey: ['userGallery'] });
                newImagesAdded = true;
              }
            } catch (err) {
              console.error('Erro ao sincronizar imagem:', err);
            }
          } else {
            console.log(`Imagem ${originalFileName} já existe no banco de dados, pulando...`);
          }
        }

        if (newImagesAdded) {
          console.log('Nova imagem adicionada, atualizando cache...');
        }
      } catch (error) {
        console.error('Erro durante a sincronização de imagens:', error);
      }
    };

    // Executar a sincronização imediatamente
    syncImages();
    
    // Executar novamente após 5 segundos para garantir
    const quickRefresh = setTimeout(() => {
      syncImages();
      
      // E mais uma vez após mais 5 segundos
      setTimeout(() => {
        syncImages();
      }, 5000);
    }, 5000);

    // Configurar intervalo para sincronização periódica
    const syncInterval = setInterval(syncImages, 15000); // a cada 15 segundos

    return () => {
      clearInterval(syncInterval);
      clearTimeout(quickRefresh);
    };
  }, [user?.id]);
};

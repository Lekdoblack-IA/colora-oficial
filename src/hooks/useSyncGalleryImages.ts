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
        let newImagesAdded = false; // Variável para controlar se novas imagens foram adicionadas
        
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

        // 2. Buscar registros existentes na tabela gallery_images
        const { data: dbImages, error: dbError } = await supabase
          .from('gallery_images')
          .select('image_url')
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
          // Construir URL pública correta para a imagem
          // IMPORTANTE: Armazenar esta URL diretamente no banco para evitar problemas de cache
          const imageUrl = supabase.storage.from('user-gallery').getPublicUrl(img.name).data.publicUrl;
          
          // Usar a mesma URL para comparação
          const publicUrl = imageUrl;
          
          // Verificar se a imagem já existe na tabela pelo nome do arquivo ou URL
          const existsByName = existingFileNames.has(img.name);
          const existsByUrl = existingImageUrls.has(publicUrl);
          const exists = existsByName || existsByUrl;
          
          console.log(`Verificando imagem ${img.name}: existsByName=${existsByName}, existsByUrl=${existsByUrl}`);
          
          if (!exists) {
            console.log(`Sincronizando imagem ${img.name} para o banco de dados`);
            
            try {
              // Gerar um ID único para a imagem baseado no timestamp e nome do arquivo
              // para garantir que cada imagem seja única
              const uniqueId = `${Date.now()}_${img.name}`;
              
              // Inserir a imagem na tabela gallery_images
              const { data, error } = await supabase
                .from('gallery_images')
                .insert([
                  {
                    user_id: user?.id,
                    image_url: imageUrl, // URL original
                    filename: img.name, // Nome do arquivo original (campo obrigatório no banco)
                    model_version: 'v1', // Campo obrigatório no banco
                    created_at: new Date().toISOString(),
                    unlocked: false,
                    // Definir data de expiração para 7 dias a partir de agora
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    // Adicionar metadados para ajudar a identificar a imagem
                    metadata: {
                      filename: img.name,
                      raw_url: imageUrl,
                      cache_key: Date.now().toString(),
                      generatedAt: Date.now(),
                      uniqueId: uniqueId,
                      sync_timestamp: Date.now(),
                      url: imageUrl // URL com parâmetros anti-cache para exibição (armazenada em metadata)
                    }
                  }
                ]);

              if (error) {
                console.error('Erro ao inserir imagem na tabela:', error);
              } else {
                console.log('Imagem sincronizada com sucesso:', data);
                // Forçar invalidação do cache para atualizar a galeria
                await queryClient.invalidateQueries(['userGallery']);
                newImagesAdded = true;
              }
            } catch (err) {
              console.error('Erro ao sincronizar imagem:', err);
            }
          } else {
            console.log(`Imagem ${img.name} já existe no banco de dados, pulando...`);
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
    const syncInterval = setInterval(syncImages, 15000); // a cada 15 segundos (reduzido de 30s)

    return () => {
      clearInterval(syncInterval);
      clearTimeout(quickRefresh);
    };
  }, [user?.id]);
};

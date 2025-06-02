
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

        // 2. Buscar registros existentes na tabela gallery_images
        const { data: dbImages, error: dbError } = await supabase
          .from('gallery_images')
          .select('image_url, filename, created_at')
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

        // Criar um Set com filenames únicos já existentes
        const existingFilenames = new Set();
        
        dbImages?.forEach(img => {
          if (img.filename) {
            existingFilenames.add(img.filename);
          }
        });
        
        console.log('Filenames existentes:', Array.from(existingFilenames));

        // 4. Para cada imagem de colorir no Storage, criar uma entrada única no banco
        for (const img of coloringImages) {
          const originalFileName = img.name;
          
          // Gerar identificadores únicos para esta entrada
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const uniqueId = `${timestamp}_${randomSuffix}`;
          
          // Construir URL pública usando o nome real do arquivo no Storage
          const imageUrl = supabase.storage.from('user-gallery').getPublicUrl(originalFileName).data.publicUrl;
          
          // Gerar filename único para o banco de dados
          const fileExtension = originalFileName.split('.').pop();
          const baseFileName = originalFileName.split('.')[0];
          const uniqueFileName = `${baseFileName}_${uniqueId}.${fileExtension}`;
          
          // Verificar se este filename único já existe
          if (!existingFilenames.has(uniqueFileName)) {
            console.log(`Criando nova entrada para imagem: ${originalFileName} com filename único: ${uniqueFileName}`);
            
            try {
              // Inserir a imagem na tabela gallery_images com dados únicos
              const { data, error } = await supabase
                .from('gallery_images')
                .insert([
                  {
                    user_id: user?.id,
                    image_url: imageUrl, // URL baseada no nome original do arquivo no Storage
                    filename: uniqueFileName, // Nome único gerado para esta entrada
                    model_version: 'v1',
                    created_at: new Date().toISOString(),
                    unlocked: false,
                    // Definir data de expiração para 7 dias a partir de agora
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                  }
                ]);

              if (error) {
                console.error('Erro ao inserir imagem na tabela:', error);
              } else {
                console.log('Nova entrada criada com sucesso:', data);
                existingFilenames.add(uniqueFileName); // Adicionar à lista para evitar duplicação
                await queryClient.invalidateQueries({ queryKey: ['userGallery'] });
                newImagesAdded = true;
              }
            } catch (err) {
              console.error('Erro ao criar entrada para imagem:', err);
            }
          } else {
            console.log(`Filename já existe: ${uniqueFileName}, pulando...`);
          }
        }

        if (newImagesAdded) {
          console.log('Novas entradas adicionadas, atualizando cache...');
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

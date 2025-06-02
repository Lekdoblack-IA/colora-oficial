import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  user_id: string;
  filename: string;
  image_url: string;
  model_version: string;
  created_at: string;
  expires_at: string | null;
  unlocked: boolean | null;
  deleted_by_system: boolean | null;
  status: string | null;
  metadata?: {
    filename?: string;
    raw_url?: string;
    [key: string]: any;
  };
}

export interface UserImage {
  id: string;
  originalUrl: string;
  url: string; // URL com parâmetros anti-cache para exibição
  createdAt: string;
  unlocked: boolean;
  name: string;
  expiresAt?: Date;
  metadata?: {
    filename?: string;
    raw_url?: string;
    cache_key?: string;
    generatedAt?: number;
    uniqueId?: string;
    [key: string]: any;
  };
}

export const useUserGallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Gerar um timestamp único para esta sessão
  const sessionTimestamp = useRef(Date.now()).current;

  // Fetch user's gallery images with more frequent refetching
  const {
    data: images = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userGallery', user?.id, sessionTimestamp],
    queryFn: async (): Promise<UserImage[]> => {
      if (!user?.id) return [];

      console.log('Buscando imagens do usuário:', user.id);

      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('user_id', user.id)
        .eq('deleted_by_system', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar imagens:', error);
        throw new Error('Erro ao carregar suas imagens');
      }

      console.log('Imagens encontradas no banco:', data?.length || 0);
      
      if (data) {
        data.forEach(img => {
          console.log(`Imagem ID: ${img.id}, URL: ${img.image_url}, Filename: ${img.filename}, Unlocked: ${img.unlocked}`);
        });
      }

      // Map Supabase data to UserImage interface com correção de URL
      return (data || []).map((img: GalleryImage): UserImage => {
        let finalImageUrl = '';
        let originalImageUrl = '';
        
        // CORREÇÃO: Verificar se image_url já é uma URL válida e não duplicada
        if (img.image_url && img.image_url.startsWith('http') && !img.image_url.includes('http://') && !img.image_url.includes('https://https://')) {
          // URL já é válida e não está duplicada
          finalImageUrl = img.image_url;
          originalImageUrl = img.image_url;
          console.log(`Usando URL direta válida para imagem ${img.id}: ${finalImageUrl}`);
        } else {
          // URL inválida ou duplicada, construir a partir do filename
          if (img.filename) {
            const { data: urlData } = supabase.storage.from('user-gallery').getPublicUrl(img.filename);
            finalImageUrl = urlData.publicUrl;
            originalImageUrl = urlData.publicUrl;
            console.log(`URL construída a partir do filename para imagem ${img.id}: ${finalImageUrl}`);
          } else {
            // Último recurso: tentar extrair filename da URL corrompida
            let extractedFilename = '';
            if (img.image_url) {
              // Procurar por padrões como "coloring_" ou "image_" na URL
              const matches = img.image_url.match(/(coloring_\d+\.png|image_\d+_\w+\.\w+)/g);
              if (matches && matches.length > 0) {
                extractedFilename = matches[matches.length - 1]; // Pegar o último match (mais específico)
              }
            }
            
            if (extractedFilename) {
              const { data: urlData } = supabase.storage.from('user-gallery').getPublicUrl(extractedFilename);
              finalImageUrl = urlData.publicUrl;
              originalImageUrl = urlData.publicUrl;
              console.log(`URL construída a partir de filename extraído para imagem ${img.id}: ${finalImageUrl}`);
            } else {
              console.error(`Não foi possível construir URL para imagem ${img.id}`);
              // Usar uma URL de fallback para evitar quebrar a aplicação
              finalImageUrl = '';
              originalImageUrl = '';
            }
          }
        }
        
        // Pular imagens sem URL válida
        if (!finalImageUrl) {
          console.warn(`Pulando imagem ${img.id} sem URL válida`);
          return null;
        }
        
        // Criar URL única para cache-busting usando o ID da imagem
        const uniqueCacheKey = `${img.id}_${sessionTimestamp}`;
        const displayUrl = `${finalImageUrl}?v=${uniqueCacheKey}`;
        
        console.log(`URL final para imagem ID: ${img.id}: ${displayUrl}`);
        
        return {
          id: img.id,
          originalUrl: finalImageUrl, // URL original limpa para download
          url: displayUrl, // URL com cache-busting para exibição
          createdAt: img.created_at,
          unlocked: img.unlocked === true,
          name: img.filename || `imagem-${img.id}`,
          expiresAt: img.expires_at ? new Date(img.expires_at) : undefined,
          metadata: {
            filename: img.filename,
            raw_url: finalImageUrl,
            image_id: img.id,
            cache_key: uniqueCacheKey
          }
        };
      }).filter(Boolean) as UserImage[]; // Remover itens null
    },
    enabled: !!user?.id,
    refetchInterval: 5000,
    staleTime: 1000,
    retry: 3,
  });

  // Unlock image mutation
  const unlockImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ unlocked: true })
        .eq('id', imageId)
        .eq('user_id', user?.id);

      if (error) {
        throw new Error('Erro ao desbloquear imagem');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGallery', user?.id] });
      toast({
        title: "Imagem desbloqueada!",
        description: "Sua imagem está disponível para download.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao desbloquear",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ deleted_by_system: true })
        .eq('id', imageId)
        .eq('user_id', user?.id);

      if (error) {
        throw new Error('Erro ao excluir imagem');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGallery', user?.id] });
      toast({
        title: "Imagem excluída",
        description: "A imagem foi removida do seu histórico.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const isImageExpired = (image: UserImage): boolean => {
    return image.expiresAt ? new Date() > image.expiresAt : false;
  };

  return {
    images,
    isLoading,
    error,
    refetch,
    unlockImage: unlockImageMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    isUnlockingImage: unlockImageMutation.isPending,
    isDeletingImage: deleteImageMutation.isPending,
    isImageExpired
  };
};

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
  url: string; // URL com ID único para exibição
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

      // Map Supabase data to UserImage interface usando ID único
      return (data || []).map((img: GalleryImage): UserImage => {
        // USAR O ID DA IMAGEM COMO IDENTIFICADOR ÚNICO
        // Ignorar completamente o filename duplicado e usar apenas o ID
        
        console.log(`Processando imagem ID: ${img.id} com filename: ${img.filename}`);
        
        // Construir URL usando o filename real do Storage, mas com ID único como parâmetro
        let finalImageUrl = '';
        let originalImageUrl = '';
        
        if (img.filename) {
          // Construir URL do Storage usando o filename
          const { data: urlData } = supabase.storage.from('user-gallery').getPublicUrl(img.filename);
          const baseUrl = urlData.publicUrl;
          
          // IMPORTANTE: Usar o ID da imagem como parâmetro único para diferenciar
          // Isso garante que mesmo com filenames iguais, cada imagem terá uma URL única
          finalImageUrl = `${baseUrl}?id=${img.id}&t=${sessionTimestamp}`;
          originalImageUrl = `${baseUrl}?id=${img.id}`;
          
          console.log(`URL construída para imagem ${img.id}: ${finalImageUrl}`);
        } else {
          console.error(`Imagem ${img.id} não tem filename`);
          return null;
        }
        
        // Pular imagens sem URL válida
        if (!finalImageUrl) {
          console.warn(`Pulando imagem ${img.id} sem URL válida`);
          return null;
        }
        
        console.log(`URL final para imagem ID: ${img.id}: ${finalImageUrl}`);
        
        return {
          id: img.id,
          originalUrl: originalImageUrl, // URL com ID único para download
          url: finalImageUrl, // URL com ID e timestamp únicos para exibição
          createdAt: img.created_at,
          unlocked: img.unlocked === true,
          name: `imagem-${img.id}`, // Nome único baseado no ID
          expiresAt: img.expires_at ? new Date(img.expires_at) : undefined,
          metadata: {
            filename: img.filename,
            raw_url: originalImageUrl,
            image_id: img.id,
            cache_key: `${img.id}_${sessionTimestamp}`
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

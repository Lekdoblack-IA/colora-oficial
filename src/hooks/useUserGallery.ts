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
  // Este timestamp é gerado apenas uma vez quando o hook é montado
  // e não muda entre renderizações
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

      // Pular a verificação do storage para evitar chamadas desnecessárias
      // que podem causar carregamento infinito

      // Agora buscamos as imagens do banco de dados
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
        // Log detalhado das imagens encontradas
        data.forEach(img => {
          console.log(`Imagem ID: ${img.id}, URL: ${img.image_url}, Unlocked: ${img.unlocked}`);
        });
      }

      // Map Supabase data to UserImage interface com validação extra
      return (data || []).map((img: GalleryImage): UserImage => {
        // IMPORTANTE: Usar diretamente a URL da imagem do banco de dados
        // Isso garante que cada imagem tenha sua própria URL única
        let imageUrl = img.image_url;
        
        // Verificar se a URL existe e é válida
        if (!imageUrl || !imageUrl.startsWith('http')) {
          console.error(`URL inválida para imagem ${img.id}: ${imageUrl}`);
          // Fallback: construir URL a partir do filename apenas se necessário
          if (img.filename) {
            imageUrl = supabase.storage.from('user-gallery').getPublicUrl(img.filename).data.publicUrl;
            console.log(`URL construída a partir do filename para imagem ${img.id}: ${imageUrl}`);
          }
        } else {
          console.log(`Usando URL direta do banco para imagem ${img.id}: ${imageUrl}`);
        }
        
        // Usar a URL diretamente do banco como URL raw
        const rawUrl = imageUrl;
        
        // SOLUÇÃO RADICAL: Gerar uma URL completamente única para cada imagem
        // e forçar o navegador a não usar o cache
        
        // Extrair a URL base sem parâmetros
        const baseUrl = rawUrl.split('?')[0];
        
        // Usar o timestamp da sessão definido no início do hook
        // Isso garante que o timestamp seja o mesmo para todas as imagens durante a sessão
        // mas diferente a cada vez que o usuário recarrega a página
        
        // Combinar ID da imagem e timestamp da sessão para criar uma URL única
        // que não mudará durante a sessão do usuário
        const uniqueId = `${img.id}_${sessionTimestamp}`;
        
        // Construir uma URL completamente nova com o ID único
        // Isso garante que cada imagem tenha uma URL única e que o navegador não use o cache
        const persistentUrl = `${baseUrl}?v=${uniqueId}`;
        
        console.log(`URL persistente para imagem ID: ${img.id}: ${persistentUrl}`);
        console.log(`Processando imagem ID: ${img.id}, URL persistente: ${persistentUrl}`);
        
        return {
          id: img.id,
          originalUrl: imageUrl, // URL original sem parâmetros de cache para download
          url: persistentUrl, // URL persistente que não muda entre renderizações
          createdAt: img.created_at,
          unlocked: img.unlocked === true,
          name: img.filename || `imagem-${img.id}`,
          expiresAt: img.expires_at ? new Date(img.expires_at) : undefined,
          metadata: {
            filename: img.filename,
            raw_url: imageUrl, // URL original sem parâmetros de cache
            image_id: img.id // Usar o ID da imagem como identificador estável
          }
        };
      });
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refetch every 5 seconds (mais frequente)
    staleTime: 1000, // Data is considered stale after 1 second (mais rápido)
    retry: 3, // Tentar 3 vezes em caso de erro
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

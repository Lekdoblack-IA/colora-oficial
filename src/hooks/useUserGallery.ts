
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
}

export interface UserImage {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  isUnlocked: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export const useUserGallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's gallery images with more frequent refetching
  const {
    data: images = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userGallery', user?.id],
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

      console.log('Imagens encontradas:', data?.length || 0);

      // Map Supabase data to UserImage interface
      return data.map((img: GalleryImage): UserImage => ({
        id: img.id,
        originalUrl: img.image_url, // We only have the transformed image
        transformedUrl: img.image_url,
        isUnlocked: img.unlocked || false,
        createdAt: new Date(img.created_at),
        expiresAt: img.expires_at ? new Date(img.expires_at) : undefined,
      }));
    },
    enabled: !!user?.id,
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 5000, // Data is considered stale after 5 seconds
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

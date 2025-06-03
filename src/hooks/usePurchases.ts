
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CreatePurchaseData {
  plan_id: string;
  amount_cents: number;
  credits_purchased: number;
  external_reference?: string;
  payment_method?: string;
}

export const usePurchases = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createPurchase = useMutation({
    mutationFn: async (purchaseData: CreatePurchaseData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          ...purchaseData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar compra:', error);
        throw new Error('Erro ao processar compra');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    }
  });

  return {
    createPurchase: createPurchase.mutate,
    isCreatingPurchase: createPurchase.isPending,
    createPurchaseError: createPurchase.error
  };
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: string;
  name: string;
  credits: number;
  price_cents: number;
  price_brl: number;
  description: string;
  is_active: boolean;
}

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async (): Promise<Plan[]> => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('credits', { ascending: true });

      if (error) {
        console.error('Erro ao buscar planos:', error);
        throw new Error('Erro ao carregar planos disponíveis');
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};


import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PackageSelector } from '../PackageSelector';
import { PackageCard } from '../PackageCard';
import { SecurityNotice } from '../SecurityNotice';
import { usePlans } from '@/hooks/usePlans';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BuyCreditsContentProps {
  onSuccess: (pixData: { pixUrl: string; pixBase64: string }) => void;
  onCreditsAdded: (credits: number) => void;
}

export const BuyCreditsContent = ({ onSuccess, onCreditsAdded }: BuyCreditsContentProps) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar planos do Supabase
  const { data: plans = [], isLoading: isLoadingPlans, error: plansError } = usePlans();
  const { createPurchase, isCreatingPurchase } = usePurchases();

  // Selecionar o plano "Plus" por padrão quando os planos carregarem
  if (plans.length > 0 && !selectedPackageId) {
    const plusPlan = plans.find(plan => plan.name.toLowerCase() === 'plus') || plans[1] || plans[0];
    setSelectedPackageId(plusPlan.id);
  }

  const selectedPlan = plans.find(plan => plan.id === selectedPackageId);

  // Mapear planos para o formato esperado pelos componentes existentes
  const mappedPackages = plans.map(plan => ({
    id: plan.id,
    name: plan.name,
    credits: plan.credits,
    pricePerCredit: Math.round(plan.price_cents / plan.credits / 100),
    totalPrice: plan.price_brl,
    description: plan.description || '',
    note: plan.name === 'Plus' ? 'Economize 40% comprando pacote "Max"' : 
          plan.name === 'Mini' ? 'Economize 20% comprando pacote "Plus"' : 
          'Melhor custo benefício!',
    isPopular: plan.name.toLowerCase() === 'plus'
  }));

  const handlePurchase = async () => {
    if (!selectedPlan || !user) return;

    setIsProcessingPayment(true);
    
    try {
      // Criar registro de compra no Supabase
      const externalReference = `${user.id}_${Date.now()}`;
      
      createPurchase({
        plan_id: selectedPlan.id,
        amount_cents: selectedPlan.price_cents,
        credits_purchased: selectedPlan.credits,
        external_reference: externalReference,
        payment_method: 'pix'
      });

      // Enviar webhook com dados da compra para N8n
      const response = await fetch('https://n8n.srv845529.hstgr.cloud/webhook/d8e707ae-093a-4e08-9069-8627eb9c1d19', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          planValue: selectedPlan.price_brl,
          planName: selectedPlan.name,
          planId: selectedPlan.id,
          credits: selectedPlan.credits,
          externalReference: externalReference
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Webhook response:', data);
        
        // Check if response contains PIX data
        if (data.pix_url && data.pix_base64) {
          onSuccess({
            pixUrl: data.pix_url,
            pixBase64: data.pix_base64
          });
        } else {
          // Fallback para desenvolvimento
          toast({
            title: "Compra processada!",
            description: "Sua compra foi registrada e está sendo processada.",
          });
        }
      } else {
        throw new Error('Payment request failed');
      }
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar sua compra. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsProcessingPayment(false);
  };

  // Loading state
  if (isLoadingPlans) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando planos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (plansError || plans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Erro ao carregar planos disponíveis</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Pacote</h2>
        <p className="text-gray-600">E use Créditos para Desbloquear o Download</p>
      </div>

      <PackageSelector 
        packages={mappedPackages}
        selectedPackage={selectedPackageId}
        onPackageChange={setSelectedPackageId}
      />

      {selectedPlan && <PackageCard selectedPackage={mappedPackages.find(p => p.id === selectedPackageId)!} />}

      {/* Savings note */}
      {selectedPlan && (
        <div className="text-center mb-4">
          <p className="text-sm text-green-600 font-medium">
            {mappedPackages.find(p => p.id === selectedPackageId)?.note}
          </p>
        </div>
      )}

      {/* CTA Button */}
      <Button 
        onClick={handlePurchase}
        disabled={isProcessingPayment || isCreatingPurchase}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full h-14 font-semibold text-lg mb-4"
      >
        {isProcessingPayment || isCreatingPurchase
          ? 'Processando...' 
          : `Comprar ${selectedPlan?.credits} ${selectedPlan?.credits === 1 ? 'Crédito' : 'Créditos'} >`
        }
      </Button>

      <SecurityNotice />
    </>
  );
};

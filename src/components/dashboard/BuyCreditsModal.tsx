import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { PackageSelector } from './PackageSelector';
import { PackageCard } from './PackageCard';
import { SecurityNotice } from './SecurityNotice';
import { PixPaymentModal } from './PixPaymentModal';
import { usePlans } from '@/hooks/usePlans';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditsAdded: (credits: number) => void;
  currentCredits: number;
}

export const BuyCreditsModal = ({ 
  isOpen, 
  onClose, 
  onCreditsAdded, 
  currentCredits 
}: BuyCreditsModalProps) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{ pixUrl: string; pixBase64: string } | null>(null);
  const isMobile = useIsMobile();
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
      const response = await fetch('https://n8n.srv845529.hstgr.cloud/webhook-test/d8e707ae-093a-4e08-9069-8627eb9c1d19', {
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
          setPixData({
            pixUrl: data.pix_url,
            pixBase64: data.pix_base64
          });
          setShowPixModal(true);
        } else {
          // Fallback para desenvolvimento
          toast({
            title: "Compra processada!",
            description: "Sua compra foi registrada e está sendo processada.",
          });
          onClose();
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

  const handlePixModalClose = () => {
    setShowPixModal(false);
    setPixData(null);
    onClose();
  };

  // Loading state
  if (isLoadingPlans) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p>Carregando planos...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (plansError || plans.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">Erro ao carregar planos disponíveis</p>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const DesktopModalHeader = () => (
    <>
      {/* Credits Counter Header */}
      <div className="bg-black text-white text-center py-3 px-6">
        <span className="text-sm font-medium">
          Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
        </span>
      </div>

      {/* Close Button in top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-16 z-10 rounded-full hover:bg-gray-100"
      >
        <X className="w-5 h-5 text-gray-500" />
      </Button>
    </>
  );

  const MobileModalHeader = () => (
    <div className="bg-black text-white relative">
      {/* Credits Counter Header */}
      <div className="text-center py-3 px-6">
        <span className="text-sm font-medium">
          Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
        </span>
      </div>

      {/* Close Button in top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-3 z-10 rounded-full hover:bg-gray-800 text-white hover:text-white"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );

  const DesktopModalContent = () => (
    <div className="relative bg-white rounded-3xl max-w-md mx-auto overflow-hidden">
      <DesktopModalHeader />

      <div className="p-8">
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
      </div>
    </div>
  );

  const MobileModalContent = () => (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <MobileModalHeader />
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="pt-4 pb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Escolha seu Pacote</h2>
            <p className="text-gray-600 text-sm">E use Créditos para Desbloquear o Download</p>
          </div>

          <div className="mb-6">
            <PackageSelector 
              packages={mappedPackages}
              selectedPackage={selectedPackageId}
              onPackageChange={setSelectedPackageId}
            />
          </div>

          {selectedPlan && (
            <div className="mb-4">
              <PackageCard selectedPackage={mappedPackages.find(p => p.id === selectedPackageId)!} />
            </div>
          )}

          {/* Savings note */}
          {selectedPlan && (
            <div className="text-center mb-6">
              <p className="text-sm text-green-600 font-medium">
                {mappedPackages.find(p => p.id === selectedPackageId)?.note}
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mb-6">
            <SecurityNotice />
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom CTA */}
      <div className="flex-shrink-0 p-6 bg-white border-t border-gray-100">
        <Button 
          onClick={handlePurchase}
          disabled={isProcessingPayment || isCreatingPurchase}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full h-14 font-semibold text-lg"
        >
          {isProcessingPayment || isCreatingPurchase
            ? 'Processando...' 
            : `Comprar ${selectedPlan?.credits} ${selectedPlan?.credits === 1 ? 'Crédito' : 'Créditos'} >`
          }
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent className="h-[85vh] border-0 p-0 rounded-t-3xl">
            <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
            <DialogDescription className="sr-only">
              Modal para escolher e comprar pacotes de créditos para desbloquear imagens
            </DialogDescription>
            <MobileModalContent />
          </DrawerContent>
        </Drawer>

        {pixData && (
          <PixPaymentModal
            isOpen={showPixModal}
            onClose={handlePixModalClose}
            pixUrl={pixData.pixUrl}
            pixBase64={pixData.pixBase64}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg border-0 p-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
          <DialogDescription className="sr-only">
            Modal para escolher e comprar pacotes de créditos para desbloquear imagens
          </DialogDescription>
          <DesktopModalContent />
        </DialogContent>
      </Dialog>

      {pixData && (
        <PixPaymentModal
          isOpen={showPixModal}
          onClose={handlePixModalClose}
          pixUrl={pixData.pixUrl}
          pixBase64={pixData.pixBase64}
        />
      )}
    </>
  );
};

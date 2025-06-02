
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
import { X } from 'lucide-react';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditsAdded: (credits: number) => void;
  currentCredits: number;
}

const packages = [
  {
    id: 'mini',
    name: 'Mini',
    credits: 1,
    pricePerCredit: 5,
    totalPrice: 5,
    description: 'Perfeito para transformar sua arte em um cartão inesquecível ou um presente de moldura.',
    note: 'Economize 20% comprando pacote "Plus"',
    isPopular: false
  },
  {
    id: 'plus',
    name: 'Plus',
    credits: 12,
    pricePerCredit: 4,
    totalPrice: 48,
    description: 'Ideal para criar uma sequência de memórias — como uma linha do tempo ou mural de fotos',
    note: 'Economize 40% comprando pacote "Max"',
    isPopular: true
  },
  {
    id: 'max',
    name: 'Max',
    credits: 24,
    pricePerCredit: 3,
    totalPrice: 72,
    description: 'A escolha perfeita para montar um álbum completo, livro personalizado ou caixa de memórias',
    note: 'Melhor custo benefício!',
    isPopular: false
  }
];

export const BuyCreditsModal = ({ 
  isOpen, 
  onClose, 
  onCreditsAdded, 
  currentCredits 
}: BuyCreditsModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState('plus');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  const handlePurchase = async () => {
    if (!selectedPkg || !user) return;

    setIsProcessingPayment(true);
    
    // Send webhook with user data
    try {
      await fetch('https://n8n.srv845529.hstgr.cloud/webhook-test/d8e707ae-093a-4e08-9069-8627eb9c1d19', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          planValue: selectedPkg.totalPrice,
          planName: selectedPkg.name
        })
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      // Continue with purchase even if webhook fails
    }
    
    // Simular processamento de pagamento
    setTimeout(() => {
      onCreditsAdded(selectedPkg.credits);
      setIsProcessingPayment(false);
    }, 2000);
  };

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
          packages={packages}
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
        />

        {selectedPkg && <PackageCard selectedPackage={selectedPkg} />}

        {/* Savings note - moved outside the border */}
        {selectedPkg?.note && (
          <div className="text-center mb-4">
            <p className="text-sm text-green-600 font-medium">
              {selectedPkg.note}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <Button 
          onClick={handlePurchase}
          disabled={isProcessingPayment}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full h-14 font-semibold text-lg mb-4"
        >
          {isProcessingPayment 
            ? 'Processando...' 
            : `Comprar ${selectedPkg?.credits} ${selectedPkg?.credits === 1 ? 'Crédito' : 'Créditos'} >`
          }
        </Button>

        <SecurityNotice />
      </div>
    </div>
  );

  const MobileModalContent = () => (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Fixed Header - Now completely black */}
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
              packages={packages}
              selectedPackage={selectedPackage}
              onPackageChange={setSelectedPackage}
            />
          </div>

          {selectedPkg && (
            <div className="mb-4">
              <PackageCard selectedPackage={selectedPkg} />
            </div>
          )}

          {/* Savings note - moved outside the border */}
          {selectedPkg?.note && (
            <div className="text-center mb-6">
              <p className="text-sm text-green-600 font-medium">
                {selectedPkg.note}
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
          disabled={isProcessingPayment}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full h-14 font-semibold text-lg"
        >
          {isProcessingPayment 
            ? 'Processando...' 
            : `Comprar ${selectedPkg?.credits} ${selectedPkg?.credits === 1 ? 'Crédito' : 'Créditos'} >`
          }
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[85vh] border-0 p-0 rounded-t-3xl">
          <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
          <DialogDescription className="sr-only">
            Modal para escolher e comprar pacotes de créditos para desbloquear imagens
          </DialogDescription>
          <MobileModalContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0 bg-transparent shadow-none">
        <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
        <DialogDescription className="sr-only">
          Modal para escolher e comprar pacotes de créditos para desbloquear imagens
        </DialogDescription>
        <DesktopModalContent />
      </DialogContent>
    </Dialog>
  );
};

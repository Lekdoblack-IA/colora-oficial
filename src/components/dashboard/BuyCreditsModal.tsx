import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, Shield, Info } from 'lucide-react';

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

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  const handlePurchase = async () => {
    if (!selectedPkg) return;

    setIsProcessingPayment(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      onCreditsAdded(selectedPkg.credits);
      setIsProcessingPayment(false);
    }, 2000);
  };

  const ModalContent = () => (
    <div className="relative bg-white rounded-3xl max-w-md mx-auto overflow-hidden">
      {/* Credits Counter Header */}
      <div className="bg-black text-white text-center py-3 px-6">
        <span className="text-sm font-medium">
          Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
        </span>
      </div>

      {/* Tooltip and Close Button */}
      <div className="absolute right-4 top-16 z-10 flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-5 h-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Seus Créditos serão adicionados automaticamente após o pagamento.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Pacote</h2>
          <p className="text-gray-600">E use Créditos para Desbloquear o Download</p>
        </div>

        {/* Package Toggle */}
        <div className="mb-8">
          <ToggleGroup 
            type="single" 
            value={selectedPackage} 
            onValueChange={(value) => value && setSelectedPackage(value)}
            className="grid grid-cols-3 w-full rounded-full bg-gray-100 p-1"
          >
            {packages.map(pkg => (
              <ToggleGroupItem 
                key={pkg.id}
                value={pkg.id} 
                className="rounded-full text-sm font-medium transition-all duration-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-pink-500 data-[state=on]:to-red-500 data-[state=on]:text-white data-[state=on]:shadow-md text-gray-600"
              >
                {pkg.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Package Details with Border */}
        {selectedPkg && (
          <div className="border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pacote {selectedPkg.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {selectedPkg.description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-pink-500 text-2xl font-bold mr-1">R$</span>
                  <span className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                    {selectedPkg.totalPrice}
                  </span>
                </div>
                
                <p className="text-pink-500 font-medium text-lg">
                  Apenas {selectedPkg.pricePerCredit} Reais por imagem!
                </p>
              </div>
              
              {/* Savings note */}
              {selectedPkg.note && (
                <p className="text-sm text-green-600 font-medium">
                  {selectedPkg.note}
                </p>
              )}
            </div>
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

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Pagamento 100% Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh] border-0">
          <ModalContent />
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
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
};

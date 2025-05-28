
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, Shield } from 'lucide-react';

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
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha seu Pacote</h2>
        <p className="text-gray-600">1 Crédito = 1 Desenho pra Colorir</p>
        <div className="mt-4 text-sm text-gray-500">
          Você tem: {currentCredits} créditos disponíveis
        </div>
      </div>

      {/* Package Toggle */}
      <div className="mb-6">
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
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-pink-500 data-[state=on]:to-red-500 data-[state=on]:text-white data-[state=on]:shadow-md"
            >
              {pkg.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Package Details */}
      {selectedPkg && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Pacote {selectedPkg.name}
            </h3>
            
            <div className="text-center mb-4">
              <span className="text-pink-500 text-lg font-bold">R$</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                {selectedPkg.totalPrice}
              </span>
            </div>
            
            <p className="text-pink-500 font-medium mb-4">
              Apenas R${selectedPkg.pricePerCredit} por imagem!
            </p>
            
            <div className="mb-4">
              <p className="font-medium text-gray-900 mb-1">
                {selectedPkg.credits} {selectedPkg.credits === 1 ? 'Desenho' : 'Desenhos'} pra Colorir
              </p>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {selectedPkg.description}
            </p>
            
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
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full h-12 font-semibold mb-4"
      >
        {isProcessingPayment 
          ? 'Processando...' 
          : `Comprar ${selectedPkg?.credits} ${selectedPkg?.credits === 1 ? 'Crédito' : 'Créditos'}`
        }
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 opacity-50">
          <Shield className="w-4 h-4" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ModalContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0">
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
};

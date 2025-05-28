
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Zap, Crown } from 'lucide-react';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (credits: number) => void;
}

const creditPackages = [
  {
    id: 'basic',
    name: 'Básico',
    credits: 5,
    price: 15,
    pricePerCredit: 3,
    icon: Star,
    description: 'Perfeito para começar',
    popular: false
  },
  {
    id: 'popular',
    name: 'Popular',
    credits: 15,
    price: 35,
    pricePerCredit: 2.33,
    icon: Zap,
    description: 'Melhor custo-benefício',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 30,
    price: 60,
    pricePerCredit: 2,
    icon: Crown,
    description: 'Para usuários intensivos',
    popular: false
  }
];

export const BuyCreditsModal = ({ isOpen, onClose, onPurchase }: BuyCreditsModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('popular');

  const handlePurchase = () => {
    const pkg = creditPackages.find(p => p.id === selectedPackage);
    if (pkg) {
      // Simulate purchase
      console.log(`Comprando ${pkg.credits} créditos por R$ ${pkg.price}`);
      onPurchase(pkg.credits);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Comprar Créditos
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {creditPackages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <Card 
                key={pkg.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
                    : 'hover:shadow-md hover:scale-102'
                } ${pkg.popular ? 'border-purple-500' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                  <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    R$ {pkg.price}
                  </div>
                  <div className="text-lg text-purple-600 font-semibold mb-2">
                    {pkg.credits} créditos
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    R$ {pkg.pricePerCredit.toFixed(2)} por crédito
                  </div>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handlePurchase}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Comprar Créditos
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Pagamento seguro • Créditos nunca expiram
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

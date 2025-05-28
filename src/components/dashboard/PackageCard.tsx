
import React from 'react';

interface Package {
  id: string;
  name: string;
  credits: number;
  pricePerCredit: number;
  totalPrice: number;
  description: string;
  note: string;
  isPopular: boolean;
}

interface PackageCardProps {
  selectedPackage: Package;
}

export const PackageCard = ({ selectedPackage }: PackageCardProps) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 mb-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Pacote {selectedPackage.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {selectedPackage.description}
        </p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-pink-500 text-2xl font-bold mr-1">R$</span>
            <span className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              {selectedPackage.totalPrice}
            </span>
          </div>
          
          <p className="text-pink-500 font-medium text-lg">
            Apenas {selectedPackage.pricePerCredit} Reais por imagem!
          </p>
        </div>
      </div>
    </div>
  );
};

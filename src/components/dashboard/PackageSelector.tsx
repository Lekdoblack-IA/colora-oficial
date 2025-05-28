
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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

interface PackageSelectorProps {
  packages: Package[];
  selectedPackage: string;
  onPackageChange: (value: string) => void;
}

export const PackageSelector = ({ packages, selectedPackage, onPackageChange }: PackageSelectorProps) => {
  return (
    <div className="mb-8">
      <ToggleGroup 
        type="single" 
        value={selectedPackage} 
        onValueChange={(value) => value && onPackageChange(value)}
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
  );
};

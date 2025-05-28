
import React from 'react';
import { Shield } from 'lucide-react';

export const SecurityNotice = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Pagamento 100% Seguro</span>
      </div>
    </div>
  );
};

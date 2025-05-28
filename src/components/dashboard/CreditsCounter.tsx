
import { Coins } from 'lucide-react';

interface CreditsCounterProps {
  credits: number;
}

export const CreditsCounter = ({
  credits
}: CreditsCounterProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white">
          <Coins className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{credits}</h3>
          <p className="text-sm text-gray-600">Créditos disponíveis</p>
        </div>
      </div>
    </div>
  );
};

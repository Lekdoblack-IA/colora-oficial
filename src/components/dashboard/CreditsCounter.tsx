
import { Coins } from 'lucide-react';

interface CreditsCounterProps {
  credits: number;
}

export const CreditsCounter = ({ credits }: CreditsCounterProps) => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-center space-x-3">
        <Coins className="w-8 h-8" />
        <div className="text-center">
          <p className="text-sm opacity-90">Seus Créditos</p>
          <p className="text-3xl font-bold">{credits}</p>
          <p className="text-sm opacity-90">
            {credits === 1 ? 'desenho disponível' : 'desenhos disponíveis'}
          </p>
        </div>
      </div>
    </div>
  );
};

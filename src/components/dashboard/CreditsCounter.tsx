
import { Coins } from 'lucide-react';

interface CreditsCounterProps {
  credits: number;
}

export const CreditsCounter = ({
  credits
}: CreditsCounterProps) => {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white mb-4">
          <Coins className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Seus Créditos
        </h2>
        <p className="text-3xl font-bold text-pink-600 mb-2">
          {credits}
        </p>
        <p className="text-gray-600">
          {credits === 1 ? 'crédito disponível' : 'créditos disponíveis'}
        </p>
      </div>
    </section>
  );
};

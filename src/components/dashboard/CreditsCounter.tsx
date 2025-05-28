
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
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-3">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Seus Créditos
            </h2>
            <p className="text-gray-600">Disponíveis para usar</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 border border-pink-100">
          <div className="text-center">
            <p className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
              {credits}
            </p>
            <p className="text-gray-600 font-medium">
              {credits === 1 ? 'crédito disponível' : 'créditos disponíveis'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              1 crédito = 1 desenho para colorir
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

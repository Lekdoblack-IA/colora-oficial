
import { Heart } from 'lucide-react';

interface ProcessingStateProps {
  currentMessage: string;
  currentIndex: number;
  totalMessages: number;
}

export const ProcessingState = ({ 
  currentMessage, 
  currentIndex, 
  totalMessages 
}: ProcessingStateProps) => {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <div className="mb-6">
          <Heart className="w-16 h-16 mx-auto text-pink-500 animate-pulse" />
        </div>
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-900 min-h-[28px] transition-opacity duration-500">
            {currentMessage}
          </p>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((currentIndex + 1) / totalMessages) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

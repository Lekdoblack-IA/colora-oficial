
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BuyCreditsContent } from './BuyCreditsContent';
import { CreditsHeader } from './CreditsHeader';

interface MobileBuyCreditsModalProps {
  currentCredits: number;
  onClose: () => void;
  onSuccess: (pixData: { pixUrl: string; pixBase64: string }) => void;
  onCreditsAdded: (credits: number) => void;
}

export const MobileBuyCreditsModal = ({ 
  currentCredits, 
  onClose, 
  onSuccess, 
  onCreditsAdded 
}: MobileBuyCreditsModalProps) => {
  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <CreditsHeader 
          currentCredits={currentCredits} 
          onClose={onClose} 
          variant="mobile" 
        />
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="pt-4 pb-8">
          <BuyCreditsContent 
            onSuccess={onSuccess}
            onCreditsAdded={onCreditsAdded}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

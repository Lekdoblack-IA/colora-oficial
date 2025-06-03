
import { BuyCreditsContent } from './BuyCreditsContent';
import { CreditsHeader } from './CreditsHeader';

interface DesktopBuyCreditsModalProps {
  currentCredits: number;
  onClose: () => void;
  onSuccess: (pixData: { pixUrl: string; pixBase64: string }) => void;
  onCreditsAdded: (credits: number) => void;
}

export const DesktopBuyCreditsModal = ({ 
  currentCredits, 
  onClose, 
  onSuccess, 
  onCreditsAdded 
}: DesktopBuyCreditsModalProps) => {
  return (
    <div className="relative bg-white rounded-3xl max-w-md mx-auto overflow-hidden">
      <CreditsHeader 
        currentCredits={currentCredits} 
        onClose={onClose} 
        variant="desktop" 
      />

      <div className="p-8">
        <BuyCreditsContent 
          onSuccess={onSuccess}
          onCreditsAdded={onCreditsAdded}
        />
      </div>
    </div>
  );
};

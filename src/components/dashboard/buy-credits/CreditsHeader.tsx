
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CreditsHeaderProps {
  currentCredits: number;
  onClose: () => void;
  variant?: 'desktop' | 'mobile';
}

export const CreditsHeader = ({ currentCredits, onClose, variant = 'desktop' }: CreditsHeaderProps) => {
  const baseClasses = "bg-black text-white relative";
  const headerClasses = variant === 'mobile' ? baseClasses : `${baseClasses} text-center py-3 px-6`;
  
  const buttonClasses = variant === 'mobile' 
    ? "absolute right-4 top-3 z-10 rounded-full hover:bg-gray-800 text-white hover:text-white"
    : "absolute right-4 top-16 z-10 rounded-full hover:bg-gray-100";

  if (variant === 'mobile') {
    return (
      <div className={headerClasses}>
        {/* Credits Counter Header */}
        <div className="text-center py-3 px-6">
          <span className="text-sm font-medium">
            Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
          </span>
        </div>

        {/* Close Button in top right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={buttonClasses}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Credits Counter Header */}
      <div className={headerClasses}>
        <span className="text-sm font-medium">
          Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
        </span>
      </div>

      {/* Close Button in top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className={buttonClasses}
      >
        <X className="w-5 h-5 text-gray-500" />
      </Button>
    </>
  );
};

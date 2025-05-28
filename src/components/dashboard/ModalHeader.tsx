
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Info } from 'lucide-react';

interface ModalHeaderProps {
  currentCredits: number;
  onClose: () => void;
}

export const ModalHeader = ({ currentCredits, onClose }: ModalHeaderProps) => {
  return (
    <>
      {/* Credits Counter Header */}
      <div className="bg-black text-white text-center py-3 px-6">
        <span className="text-sm font-medium">
          Você tem: <span className="font-bold">{currentCredits} Créditos</span> disponíveis
        </span>
      </div>

      {/* Tooltip in top left */}
      <div className="absolute left-4 top-16 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-5 h-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Seus Créditos serão adicionados automaticamente após o pagamento.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Close Button in top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-16 z-10 rounded-full hover:bg-gray-100"
      >
        <X className="w-5 h-5 text-gray-500" />
      </Button>
    </>
  );
};

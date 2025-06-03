
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { PixPaymentModal } from './PixPaymentModal';
import { MobileBuyCreditsModal } from './buy-credits/MobileBuyCreditsModal';
import { DesktopBuyCreditsModal } from './buy-credits/DesktopBuyCreditsModal';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditsAdded: (credits: number) => void;
  currentCredits: number;
}

export const BuyCreditsModal = ({ 
  isOpen, 
  onClose, 
  onCreditsAdded, 
  currentCredits 
}: BuyCreditsModalProps) => {
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{ pixUrl: string; pixBase64: string } | null>(null);
  const isMobile = useIsMobile();

  const handleSuccess = (data: { pixUrl: string; pixBase64: string }) => {
    setPixData(data);
    setShowPixModal(true);
  };

  const handlePixModalClose = () => {
    setShowPixModal(false);
    setPixData(null);
    onClose();
  };

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent className="h-[85vh] border-0 p-0 rounded-t-3xl">
            <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
            <DialogDescription className="sr-only">
              Modal para escolher e comprar pacotes de créditos para desbloquear imagens
            </DialogDescription>
            <MobileBuyCreditsModal 
              currentCredits={currentCredits}
              onClose={onClose}
              onSuccess={handleSuccess}
              onCreditsAdded={onCreditsAdded}
            />
          </DrawerContent>
        </Drawer>

        {pixData && (
          <PixPaymentModal
            isOpen={showPixModal}
            onClose={handlePixModalClose}
            pixUrl={pixData.pixUrl}
            pixBase64={pixData.pixBase64}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg border-0 p-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Comprar Créditos</DialogTitle>
          <DialogDescription className="sr-only">
            Modal para escolher e comprar pacotes de créditos para desbloquear imagens
          </DialogDescription>
          <DesktopBuyCreditsModal 
            currentCredits={currentCredits}
            onClose={onClose}
            onSuccess={handleSuccess}
            onCreditsAdded={onCreditsAdded}
          />
        </DialogContent>
      </Dialog>

      {pixData && (
        <PixPaymentModal
          isOpen={showPixModal}
          onClose={handlePixModalClose}
          pixUrl={pixData.pixUrl}
          pixBase64={pixData.pixBase64}
        />
      )}
    </>
  );
};

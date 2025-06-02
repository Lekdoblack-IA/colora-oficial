
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixUrl: string;
  pixBase64: string;
}

export const PixPaymentModal = ({ isOpen, onClose, pixUrl, pixBase64 }: PixPaymentModalProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleCopyPixUrl = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(pixUrl);
      toast({
        title: "PIX copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar PIX:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive"
      });
    } finally {
      setIsCopying(false);
    }
  };

  const PixContent = () => (
    <div className="text-center space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento PIX</h3>
        <p className="text-gray-600 text-sm">Escaneie o QR Code ou copie o código PIX</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border">
          <img 
            src={`data:image/png;base64,${pixBase64}`}
            alt="QR Code PIX"
            className="w-64 h-64 object-contain"
          />
        </div>
      </div>

      {/* Copy PIX Button */}
      <Button 
        onClick={handleCopyPixUrl}
        disabled={isCopying}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg h-12 font-semibold"
      >
        <Copy className="w-4 h-4 mr-2" />
        {isCopying ? 'Copiando...' : 'Copiar código PIX'}
      </Button>

      <p className="text-xs text-gray-500">
        Após o pagamento, seus créditos serão adicionados automaticamente
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh] border-0 p-0 rounded-t-3xl">
          <DialogTitle className="sr-only">Pagamento PIX</DialogTitle>
          <DialogDescription className="sr-only">
            Modal para pagamento via PIX com QR Code
          </DialogDescription>
          
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            
            <PixContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <DialogTitle className="sr-only">Pagamento PIX</DialogTitle>
        <DialogDescription className="sr-only">
          Modal para pagamento via PIX com QR Code
        </DialogDescription>
        
        <div className="relative bg-white rounded-3xl overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
          
          <div className="p-8">
            <PixContent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

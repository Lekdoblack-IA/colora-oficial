
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DashboardHowItWorks } from '@/components/dashboard/DashboardHowItWorks';
import { TransformImageSection } from '@/components/dashboard/TransformImageSection';
import { UserImagesGallery } from '@/components/dashboard/UserImagesGallery';
import { BuyCreditsModal } from '@/components/dashboard/BuyCreditsModal';
import { useToast } from '@/hooks/use-toast';
import { useUserGallery } from '@/hooks/useUserGallery';
import { useSyncGalleryImages } from '@/hooks/useSyncGalleryImages';

const Dashboard = () => {
  const { user, logout, updateCredits } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [selectedImageToUnlock, setSelectedImageToUnlock] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Usar o hook de sincronização para garantir que as imagens do Storage apareçam na galeria
  useSyncGalleryImages();

  // Use real gallery data from Supabase
  const {
    images: userImages,
    isLoading: isLoadingImages,
    unlockImage,
    deleteImage,
    isImageExpired,
    refetch: refetchImages
  } = useUserGallery();

  // Auto-refresh gallery every 10 seconds when not processing
  useEffect(() => {
    if (!isProcessing) {
      const interval = setInterval(() => {
        console.log('Auto-refresh da galeria executado');
        refetchImages();
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [isProcessing, refetchImages]);

  const handleImageTransformed = () => {
    console.log('handleImageTransformed chamado - atualizando galeria');
    
    // Manter o estado de processamento ativo por um tempo mínimo
    setIsProcessing(true);
    
    // Immediate refresh
    refetchImages();
    
    // Configurar uma série de refreshes para garantir que a imagem seja capturada
    // e manter o indicador de processamento ativo até que a imagem seja realmente exibida
    
    // Primeiro refresh após 5 segundos
    const refresh1 = setTimeout(() => {
      console.log('Refresh adicional 1 executado');
      refetchImages();
    }, 5000);
    
    // Segundo refresh após 15 segundos
    const refresh2 = setTimeout(() => {
      console.log('Refresh adicional 2 executado');
      refetchImages();
    }, 15000);
    
    // Terceiro refresh após 30 segundos
    const refresh3 = setTimeout(() => {
      console.log('Refresh adicional 3 executado');
      refetchImages();
    }, 30000);
    
    // Último refresh após 45 segundos e desativar o estado de processamento
    const finalRefresh = setTimeout(() => {
      console.log('Refresh final executado');
      refetchImages();
      setIsProcessing(false); // Desativar o estado de processamento apenas quando temos certeza que a imagem foi processada
    }, 45000);
    
    // Limpar os timeouts se o componente for desmontado
    return () => {
      clearTimeout(refresh1);
      clearTimeout(refresh2);
      clearTimeout(refresh3);
      clearTimeout(finalRefresh);
    };
  };

  const handleUnlockImage = (imageId: string) => {
    if (!user || user.credits < 1) {
      setSelectedImageToUnlock(imageId);
      setShowBuyCreditsModal(true);
      return;
    }

    // Update user credits first
    updateCredits(user.credits - 1);
    
    // Then unlock the image in Supabase
    unlockImage(imageId);
  };

  const handleDeleteImage = (imageId: string) => {
    deleteImage(imageId);
  };

  const handleCreditsAdded = (credits: number) => {
    if (user) {
      updateCredits(user.credits + credits);
    }
    setShowBuyCreditsModal(false);
    
    // If there was an image selected for unlocking, unlock it automatically
    if (selectedImageToUnlock && user) {
      handleUnlockImage(selectedImageToUnlock);
      setSelectedImageToUnlock(null);
    }

    toast({
      title: "Créditos adicionados!",
      description: `${credits} crédito${credits > 1 ? 's' : ''} adicionado${credits > 1 ? 's' : ''} à sua conta.`,
    });
  };

  const canTransformNewImage = () => {
    const unlockedImages = userImages.filter(img => !img.unlocked && !isImageExpired(img));
    return unlockedImages.length < 2;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userCredits={user?.credits || 0} 
        onCreditsAdded={handleCreditsAdded}
        isLoggedIn={!!user}
        onLogout={logout}
      />
      
      <main className="pt-24 md:pt-32 flex-1">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-6 md:space-y-12">
          <DashboardHowItWorks />
          <TransformImageSection 
            onImageTransformed={handleImageTransformed}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            canTransform={canTransformNewImage()}
          />
          <UserImagesGallery 
            images={userImages}
            onUnlockImage={handleUnlockImage}
            onDeleteImage={handleDeleteImage}
            isImageExpired={isImageExpired}
            isLoading={isLoadingImages}
          />
        </div>
      </main>

      <Footer />

      <BuyCreditsModal 
        isOpen={showBuyCreditsModal}
        onClose={() => {
          setShowBuyCreditsModal(false);
          setSelectedImageToUnlock(null);
        }}
        onCreditsAdded={handleCreditsAdded}
        currentCredits={user?.credits || 0}
      />
    </div>
  );
};

export default Dashboard;

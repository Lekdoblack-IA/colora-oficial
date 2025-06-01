
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DashboardHowItWorks } from '@/components/dashboard/DashboardHowItWorks';
import { TransformImageSection } from '@/components/dashboard/TransformImageSection';
import { UserImagesGallery } from '@/components/dashboard/UserImagesGallery';
import { BuyCreditsModal } from '@/components/dashboard/BuyCreditsModal';
import { useToast } from '@/hooks/use-toast';
import { useUserGallery } from '@/hooks/useUserGallery';

const Dashboard = () => {
  const { user, logout, updateCredits } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [selectedImageToUnlock, setSelectedImageToUnlock] = useState<string | null>(null);
  const { toast } = useToast();

  // Use real gallery data from Supabase
  const {
    images: userImages,
    isLoading: isLoadingImages,
    unlockImage,
    deleteImage,
    isImageExpired,
    refetch: refetchImages
  } = useUserGallery();

  const handleImageTransformed = () => {
    // After successful N8N processing, just show success message
    // The image will appear automatically when N8N saves to Supabase
    toast({
      title: "Imagem enviada com sucesso!",
      description: "Sua imagem está sendo processada. Ela aparecerá aqui em breve.",
    });
    
    // Refetch images to show any new ones
    setTimeout(() => {
      refetchImages();
    }, 2000);
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
    const unlockedImages = userImages.filter(img => !img.isUnlocked && !isImageExpired(img));
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

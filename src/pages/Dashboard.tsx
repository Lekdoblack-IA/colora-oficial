
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DashboardHowItWorks } from '@/components/dashboard/DashboardHowItWorks';
import { TransformImageSection } from '@/components/dashboard/TransformImageSection';
import { UserImagesGallery } from '@/components/dashboard/UserImagesGallery';
import { BuyCreditsModal } from '@/components/dashboard/BuyCreditsModal';
import { useToast } from '@/hooks/use-toast';

interface UserImage {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  isUnlocked: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

const Dashboard = () => {
  const { user, logout, updateCredits } = useAuth();
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [selectedImageToUnlock, setSelectedImageToUnlock] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageTransformed = (originalUrl: string, transformedUrl: string) => {
    const newImage: UserImage = {
      id: Date.now().toString(),
      originalUrl,
      transformedUrl,
      isUnlocked: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas
    };

    setUserImages(prev => [newImage, ...prev]);
    
    toast({
      title: "Imagem transformada com sucesso!",
      description: "Sua imagem foi adicionada à galeria abaixo.",
    });
  };

  const handleUnlockImage = (imageId: string) => {
    if (!user || user.credits < 1) {
      setSelectedImageToUnlock(imageId);
      setShowBuyCreditsModal(true);
      return;
    }

    updateCredits(user.credits - 1);
    setUserImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, isUnlocked: true, expiresAt: undefined }
          : img
      )
    );

    toast({
      title: "Imagem desbloqueada!",
      description: "Sua imagem está disponível para download.",
    });
  };

  const handleCreditsAdded = (credits: number) => {
    if (user) {
      updateCredits(user.credits + credits);
    }
    setShowBuyCreditsModal(false);
    
    // Se havia uma imagem selecionada para desbloquear, desbloqueie automaticamente
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

  const isImageExpired = (image: UserImage) => {
    return image.expiresAt && new Date() > image.expiresAt;
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
            isImageExpired={isImageExpired}
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

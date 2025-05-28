
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [userCredits, setUserCredits] = useState(5); // Mock inicial
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [selectedImageToUnlock, setSelectedImageToUnlock] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simular verificação de login
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

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
    if (userCredits < 1) {
      setSelectedImageToUnlock(imageId);
      setShowBuyCreditsModal(true);
      return;
    }

    setUserCredits(prev => prev - 1);
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
    setUserCredits(prev => prev + credits);
    setShowBuyCreditsModal(false);
    
    // Se havia uma imagem selecionada para desbloquear, desbloqueie automaticamente
    if (selectedImageToUnlock) {
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userCredits={userCredits} onCreditsAdded={handleCreditsAdded} />
      
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
        currentCredits={userCredits}
      />
    </div>
  );
};

export default Dashboard;

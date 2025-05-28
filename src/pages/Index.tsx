
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GallerySection from '@/components/GallerySection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

const Index = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header 
        isLoggedIn={!!user}
        onLogout={logout}
        onAuthModalOpen={handleAuthModalOpen}
        userCredits={user?.credits || 0}
      />
      <HeroSection 
        isLoggedIn={!!user} 
        onAuthModalOpen={handleAuthModalOpen} 
      />
      <GallerySection />
      <HowItWorksSection />
      <PricingSection 
        isLoggedIn={!!user} 
        onAuthModalOpen={handleAuthModalOpen} 
      />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose} 
      />
    </div>
  );
};

export default Index;

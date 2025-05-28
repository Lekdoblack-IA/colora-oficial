
import { useState } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAuthModalOpen={handleAuthModalOpen}
      />
      <HeroSection 
        isLoggedIn={isLoggedIn} 
        onAuthModalOpen={handleAuthModalOpen} 
      />
      <GallerySection />
      <HowItWorksSection />
      <PricingSection 
        isLoggedIn={isLoggedIn} 
        onAuthModalOpen={handleAuthModalOpen} 
      />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

export default Index;


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
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleAuthModalOpen = () => {
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection isLoggedIn={isLoggedIn} onAuthModalOpen={handleAuthModalOpen} />
      <GallerySection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

export default Index;


import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BuyCreditsModal } from './dashboard/BuyCreditsModal';
import { HeaderLogo } from './header/HeaderLogo';
import { HeaderNavigation } from './header/HeaderNavigation';
import { HeaderBanner } from './header/HeaderBanner';

interface HeaderProps {
  userCredits?: number;
  onCreditsAdded?: (credits: number) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onAuthModalOpen?: () => void;
}

const Header = ({ 
  onCreditsAdded, 
  onAuthModalOpen
}: HeaderProps) => {
  const { user, logout, updateCredits } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    if (isDashboard) {
      navigate('/');
    }
    console.log('Logout realizado');
  };

  const handleOpenAuthModal = () => {
    if (onAuthModalOpen) {
      onAuthModalOpen();
    }
  };

  const handleBuyCredits = () => {
    setIsBuyCreditsOpen(true);
  };

  const handleCreditsAdded = (credits: number) => {
    setIsBuyCreditsOpen(false);
    updateCredits((user?.credits || 0) + credits);
    if (onCreditsAdded) {
      onCreditsAdded(credits);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-[25px]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <HeaderLogo 
              isDashboard={isDashboard} 
              isLoggedIn={!!user} 
              userCredits={user?.credits || 0} 
            />

            <div className="flex items-center space-x-4">
              <HeaderNavigation
                isLoggedIn={!!user}
                isDashboard={isDashboard}
                userEmail={user?.email || ""}
                onOpenAuthModal={handleOpenAuthModal}
                onLogout={handleLogout}
                onBuyCredits={handleBuyCredits}
                onGoHome={handleGoHome}
                onGoDashboard={handleGoDashboard}
                userCredits={user?.credits || 0}
              />
            </div>
          </div>
        </div>
        
        <HeaderBanner isDashboard={isDashboard} isScrolled={isScrolled} />
      </header>

      <BuyCreditsModal 
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
        onCreditsAdded={handleCreditsAdded}
        currentCredits={user?.credits || 0}
      />
    </>
  );
};

export default Header;

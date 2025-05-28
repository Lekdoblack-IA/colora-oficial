
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { BuyCreditsModal } from './dashboard/BuyCreditsModal';
import { HeaderLogo } from './header/HeaderLogo';
import { HeaderNavigation } from './header/HeaderNavigation';
import { HeaderBanner } from './header/HeaderBanner';

interface HeaderProps {
  userCredits?: number;
  onCreditsAdded?: (credits: number) => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header = ({ 
  userCredits = 5, 
  onCreditsAdded, 
  isLoggedIn = false,
  onLogin,
  onLogout
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [userEmail] = useState("usuario@exemplo.com");
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
    if (onLogout) {
      onLogout();
    }
    if (isDashboard) {
      navigate('/');
    }
    console.log('Logout realizado');
  };

  const handleLogin = () => {
    setIsAuthOpen(false);
    if (onLogin) {
      onLogin();
    }
  };

  const handleOpenAuthModal = () => {
    setIsAuthOpen(true);
  };

  const handleBuyCredits = () => {
    setIsBuyCreditsOpen(true);
  };

  const handleCreditsAdded = (credits: number) => {
    setIsBuyCreditsOpen(false);
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
              isLoggedIn={isLoggedIn} 
              userCredits={userCredits} 
            />

            <div className="flex items-center space-x-4">
              <HeaderNavigation
                isLoggedIn={isLoggedIn}
                isDashboard={isDashboard}
                userEmail={userEmail}
                onOpenAuthModal={handleOpenAuthModal}
                onLogout={handleLogout}
                onBuyCredits={handleBuyCredits}
                onGoHome={handleGoHome}
                onGoDashboard={handleGoDashboard}
              />
            </div>
          </div>
        </div>
        
        <HeaderBanner isDashboard={isDashboard} isScrolled={isScrolled} />
      </header>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />
      
      <BuyCreditsModal 
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
        onCreditsAdded={handleCreditsAdded}
        currentCredits={userCredits}
      />
    </>
  );
};

export default Header;


import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, ChevronDown, LogOut, CreditCard, Coins, Home, LayoutDashboard } from "lucide-react";
import { AuthModal } from './AuthModal';
import { BuyCreditsModal } from './dashboard/BuyCreditsModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userCredits?: number;
  onCreditsAdded?: (credits: number) => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onAuthModalOpen?: () => void;
}

const Header = ({ 
  userCredits = 5, 
  onCreditsAdded, 
  isLoggedIn: propIsLoggedIn,
  onLogin,
  onAuthModalOpen 
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [internalIsLoggedIn, setInternalIsLoggedIn] = useState(true);
  const [userEmail] = useState("usuario@exemplo.com");
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : internalIsLoggedIn;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (isDashboard) {
      setInternalIsLoggedIn(false);
      navigate('/');
    } else {
      // Reset login state for home page
      if (propIsLoggedIn === undefined) {
        setInternalIsLoggedIn(false);
      }
    }
    console.log('Logout realizado');
  };

  const handleLogin = () => {
    if (isDashboard) {
      setInternalIsLoggedIn(true);
      setIsAuthOpen(false);
      navigate('/dashboard');
    } else {
      onLogin?.();
      setIsAuthOpen(false);
    }
  };

  const handleOpenAuthModal = () => {
    if (onAuthModalOpen && !isDashboard) {
      onAuthModalOpen();
    } else {
      setIsAuthOpen(true);
    }
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

  return <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Header principal com glassmorphism */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-[25px]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo ou Contador de Créditos */}
            {isDashboard && isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg px-4 py-2 text-white">
                <Coins className="w-5 h-5" />
                <div className="text-center">
                  <p className="text-xs opacity-90">Seus Créditos</p>
                  <p className="text-lg font-bold">{userCredits}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                {isScrolled ? 
                  <img 
                    alt="Clr♡" 
                    className="h-8 transition-all duration-300" 
                    src="/lovable-uploads/0d4e9f12-e51b-41e2-b9cd-9910f8f3e9ee.png" 
                  /> : 
                  <img 
                    src="/lovable-uploads/ee0393c6-5834-4e27-b4e2-7731aac513e6.png" 
                    alt="Colora♡" 
                    className="h-10 md:h-10 transition-all duration-300" 
                  />
                }
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <Button 
                  onClick={handleOpenAuthModal} 
                  variant="outline" 
                  className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200"
                >
                  Login
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Minha Conta</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Minha Conta</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Navegação condicional baseada na página atual */}
                    {isDashboard ? (
                      <DropdownMenuItem onClick={handleGoHome}>
                        <Home className="mr-2 h-4 w-4" />
                        Voltar para o Inicio
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={handleGoDashboard}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Ir para Dashboard
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={handleBuyCredits}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Comprar Créditos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        
        {/* Banner fixo abaixo do cabeçalho - não exibir no dashboard */}
        {!isDashboard && (
          <div className={`bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-red-600/80 backdrop-blur-sm text-white text-center text-sm transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0' : 'h-auto py-2'}`}>
            <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
              <span className="animate-pulse-heart bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text font-medium text-slate-50">
                Veja o resultado e só pague se amar
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Modal de autenticação apenas para dashboard */}
      {isDashboard && (
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
      )}
      
      <BuyCreditsModal 
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
        onCreditsAdded={handleCreditsAdded}
        currentCredits={userCredits}
      />
    </>;
};

export default Header;

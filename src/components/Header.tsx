
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, ChevronDown, LogOut, CreditCard } from "lucide-react";
import { AuthModal } from './AuthModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulando usuário logado no dashboard
  const [userEmail] = useState("usuario@exemplo.com"); // Mock do email do usuário
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se está na página do dashboard
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    console.log('Logout realizado');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    navigate('/dashboard');
  };

  const handleBuyCredits = () => {
    // Esta função será conectada ao modal de comprar créditos
    console.log('Abrir modal de comprar créditos');
  };

  const handleInicio = () => {
    navigate('/');
  };

  return <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Header principal com glassmorphism */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-[25px]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo - Desktop e Mobile */}
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

            {/* Navigation - Desktop e Mobile */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <Button 
                  onClick={() => setIsAuthOpen(true)} 
                  variant="outline" 
                  className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200"
                >
                  Entrar
                </Button>
              ) : (
                <>
                  {/* Botão Início */}
                  <Button 
                    onClick={handleInicio}
                    variant="ghost" 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 hidden md:flex"
                  >
                    Início
                  </Button>
                  
                  {/* Dropdown Minha Conta */}
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
                      <DropdownMenuItem onClick={handleInicio} className="md:hidden">
                        Início
                      </DropdownMenuItem>
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
                </>
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

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
    </>;
};

export default Header;

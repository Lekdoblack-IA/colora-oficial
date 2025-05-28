
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, User, ChevronDown } from "lucide-react";
import { AuthModal } from './AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log('Logout realizado');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Header principal com glassmorphism */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              <span className={`font-bold transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-2xl'
              }`}>
                {isScrolled ? 'Clr♡' : 'Colora ♡'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              {!isLoggedIn ? (
                <Button 
                  onClick={() => setIsAuthOpen(true)}
                  variant="outline" 
                  className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200"
                >
                  Entrar
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Minha Conta</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile - Logo centralizada (sem botões) */}
            <div className="md:hidden" />
          </div>
        </div>
        
        {/* Banner fixo abaixo do cabeçalho com retração no scroll */}
        <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-center text-sm transition-all duration-300 overflow-hidden ${
          isScrolled 
            ? 'h-0 py-0' 
            : 'h-auto py-2'
        }`}>
          <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
            ✨ Veja o resultado e só pague se amar
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;

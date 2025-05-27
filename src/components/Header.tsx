
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { AuthModal } from './AuthModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Banner fixo */}
        <div className="bg-black text-white text-center py-2 text-sm">
          ✨ Veja o resultado e só pague se amar
        </div>
        
        {/* Header principal */}
        <div className="bg-transparent backdrop-blur-none px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              <span className={`font-bold text-xl transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-2xl'
              }`}>
                {isScrolled ? 'Clr♡' : 'Colora ♡'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Button 
                onClick={() => setIsAuthOpen(true)}
                variant="outline" 
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                Entrar
              </Button>
            </div>

            {/* Mobile - Logo centralizada */}
            <div className="md:hidden" />
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;

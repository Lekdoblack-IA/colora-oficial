
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins } from "lucide-react";

interface HeaderLogoProps {
  isDashboard: boolean;
  isLoggedIn: boolean;
  userCredits: number;
}

export const HeaderLogo = ({ isDashboard, isLoggedIn, userCredits }: HeaderLogoProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard && isLoggedIn) {
    return (
      <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg px-4 py-2 text-white">
        <Coins className="w-5 h-5" />
        <div className="text-center">
          <p className="text-xs opacity-90">Seus Créditos</p>
          <p className="text-lg font-bold">{userCredits}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
      {isScrolled ? 
        <img 
          alt="Clr♡" 
          className="h-6 md:h-8 transition-all duration-300" 
          src="/lovable-uploads/0d4e9f12-e51b-41e2-b9cd-9910f8f3e9ee.png" 
        /> : 
        <img 
          src="/lovable-uploads/ee0393c6-5834-4e27-b4e2-7731aac513e6.png" 
          alt="Colora♡" 
          className="h-8 md:h-10 transition-all duration-300" 
        />
      }
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ScratchCard from './ScratchCard';

interface HeroSectionProps {
  isLoggedIn?: boolean;
  onAuthModalOpen?: () => void;
}

const HeroSection = ({ isLoggedIn = false, onAuthModalOpen }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    console.log('Start button clicked, isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('User is logged in, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('User not logged in, opening auth modal');
      if (onAuthModalOpen) {
        onAuthModalOpen();
      } else {
        console.error('onAuthModalOpen function not provided');
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Lado esquerdo - Conteúdo */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in-up">
              Transforme suas{' '}
              <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                memórias
              </span>{' '}
              em páginas para colorir.
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{
              animationDelay: '0.2s'
            }}>
              Eternize os momentos especiais em desenhos únicos que contam sua história de amor.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{
            animationDelay: '0.4s'
          }}>
            <Button 
              onClick={handleStartClick}
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              Começar
            </Button>
          </div>

          {/* Prova Social */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-fade-in-up" style={{
            animationDelay: '0.6s'
          }}>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="font-semibold">+ 1,486 Memórias Eternizadas</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600">4.9/5 </span>
            </div>
          </div>
        </div>

        {/* Lado direito - Raspadinha */}
        <div className="animate-fade-in-up" style={{
          animationDelay: '0.8s'
        }}>
          <ScratchCard isLoggedIn={isLoggedIn} onAuthModalOpen={onAuthModalOpen} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

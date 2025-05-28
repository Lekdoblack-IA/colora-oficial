
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Download, Palette, Plus, Star, Zap } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { BuyCreditsModal } from '@/components/dashboard/BuyCreditsModal';
import { TransformImageModal } from '@/components/dashboard/TransformImageModal';
import { ImageGallery } from '@/components/dashboard/ImageGallery';

// Mock data for demonstration
const mockUserImages = [
  {
    id: '1',
    originalUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
    transformedUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    status: 'completed' as const,
    createdAt: new Date().toISOString(),
    title: 'Family Photo'
  },
  {
    id: '2',
    originalUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400',
    transformedUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400',
    status: 'processing' as const,
    createdAt: new Date().toISOString(),
    title: 'Nature Shot'
  }
];

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged in state
  const [userCredits, setUserCredits] = useState(3);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [isTransformOpen, setIsTransformOpen] = useState(false);
  const [userImages, setUserImages] = useState(mockUserImages);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleBuyCredits = (credits: number) => {
    setUserCredits(prev => prev + credits);
    setIsBuyCreditsOpen(false);
  };

  const handleTransformImage = (imageFile: File) => {
    if (userCredits <= 0) {
      setIsBuyCreditsOpen(true);
      return;
    }

    // Create new image entry
    const newImage = {
      id: Date.now().toString(),
      originalUrl: URL.createObjectURL(imageFile),
      transformedUrl: '',
      status: 'processing' as const,
      createdAt: new Date().toISOString(),
      title: imageFile.name
    };

    setUserImages(prev => [newImage, ...prev]);
    setUserCredits(prev => prev - 1);
    setIsTransformOpen(false);

    // Simulate processing
    setTimeout(() => {
      setUserImages(prev => prev.map(img => 
        img.id === newImage.id 
          ? { ...img, status: 'completed', transformedUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' }
          : img
      ));
    }, 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Acesse seu Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/ee0393c6-5834-4e27-b4e2-7731aac513e6.png" 
              alt="Colora♡" 
              className="h-10" 
            />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-2 rounded-full">
              <Star className="h-4 w-4" />
              <span className="font-medium">{userCredits} créditos</span>
            </div>
            <Button 
              onClick={() => setIsBuyCreditsOpen(true)}
              variant="outline"
              className="bg-white/90 hover:bg-white border-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Comprar Créditos
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* How it Works Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Como <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Funciona</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Envie sua foto", description: "Escolha aquela foto que carrega uma memória especial." },
              { icon: Sparkles, title: "A magia acontece", description: "Como num passe de mágica, sua lembrança vira arte." },
              { icon: Download, title: "Receba sua arte", description: "Receba seu desenho digital na hora e imprima sempre que quiser." },
              { icon: Palette, title: "Pinte ou presenteie", description: "Dê vida ao desenho ou compartilhe a memória com alguém especial." }
            ].map((step, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 mb-4 group-hover:shadow-lg transition-all duration-300">
                    <step.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Transform New Image Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
            <CardContent className="p-8 text-center">
              <Zap className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Transforme uma Nova Imagem</h2>
              <p className="text-white/90 mb-6 text-lg">
                Transforme suas memórias em arte única em segundos
              </p>
              <Button 
                onClick={() => setIsTransformOpen(true)}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                disabled={userCredits <= 0}
              >
                {userCredits <= 0 ? 'Sem créditos disponíveis' : 'Transformar Imagem'}
              </Button>
              {userCredits <= 0 && (
                <p className="text-white/80 mt-2 text-sm">
                  <button 
                    onClick={() => setIsBuyCreditsOpen(true)}
                    className="underline hover:text-white"
                  >
                    Compre créditos para continuar
                  </button>
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Your Images Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">
            Suas <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Imagens</span>
          </h2>
          <ImageGallery images={userImages} />
        </section>
      </main>

      {/* Modals */}
      <BuyCreditsModal 
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
        onPurchase={handleBuyCredits}
      />
      
      <TransformImageModal
        isOpen={isTransformOpen}
        onClose={() => setIsTransformOpen(false)}
        onTransform={handleTransformImage}
        userCredits={userCredits}
      />
    </div>
  );
};

export default Dashboard;

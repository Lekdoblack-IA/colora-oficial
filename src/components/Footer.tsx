import { Heart } from 'lucide-react';
const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img alt="Colora♡" className="h-8" src="/lovable-uploads/0f9cbd95-67ce-4b8a-9293-9b80892d6546.png" />
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transforme suas memórias mais especiais em desenhos únicos para colorir. 
              Eternize momentos afetivos de forma criativa e interativa.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Transformando memórias em experiência.</span>
              <Heart className="w-4 h-4 mx-1 text-pink-500" />
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">
                  Preços
                </button>
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left">
                  Central de Ajuda
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Whatsapp</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Colora. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
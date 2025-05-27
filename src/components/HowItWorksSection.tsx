
import { Upload, Sparkles, Download, Palette } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Envie sua foto",
    description: "Escolha aquela foto que carrega uma memória especial."
  },
  {
    number: 2,
    icon: Sparkles,
    title: "A magia acontece",
    description: "Como num passe de mágica, sua lembrança vira arte."
  },
  {
    number: 3,
    icon: Download,
    title: "Receba sua arte",
    description: "Receba seu desenho digital na hora e imprima sempre que quiser."
  },
  {
    number: 4,
    icon: Palette,
    title: "Pinte ou presenteie",
    description: "Dê vida ao desenho ou compartilhe a memória com alguém especial."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              funciona
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Simples, rápido e mágico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Número */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-black mb-6 group-hover:border-transparent group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>

                {/* Ícone */}
                <div className="mb-4">
                  <Icon className="w-12 h-12 mx-auto text-gray-600 group-hover:text-pink-500 transition-colors duration-300" />
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Linha conectora */}
        <div className="hidden lg:block relative mt-16">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <svg 
            className="absolute top-0 left-0 w-full h-px stroke-animation" 
            viewBox="0 0 1200 2" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0 1L1200 1" 
              stroke="url(#gradient)" 
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

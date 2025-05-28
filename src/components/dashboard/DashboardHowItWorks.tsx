
import { Upload, Sparkles, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: "Envie sua foto",
    description: "Escolha uma imagem especial"
  },
  {
    icon: Sparkles,
    title: "Nossa IA transforma em desenho",
    description: "Magia acontece automaticamente"
  },
  {
    icon: CreditCard,
    title: "Use Créditos e libere o download",
    description: "Imagem em alta qualidade"
  }
];

export const DashboardHowItWorks = () => {
  return (
    <section className="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Como Funciona
        </h2>
        <p className="text-sm md:text-base text-gray-600">Simples e rápido em 3 passos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white mb-3 md:mb-4">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{step.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

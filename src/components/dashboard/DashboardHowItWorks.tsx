
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
    <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Como Funciona
        </h2>
        <p className="text-gray-600">Simples e rápido em 3 passos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

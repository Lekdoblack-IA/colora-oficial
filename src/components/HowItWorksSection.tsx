import { Upload, Sparkles, Download, Palette } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCenterAlignment } from '../hooks/useCenterAlignment';
import { useIsMobile } from '../hooks/use-mobile';
const steps = [{
  number: 1,
  icon: Upload,
  title: "Envie sua foto",
  description: "Escolha aquela foto que carrega uma memória especial."
}, {
  number: 2,
  icon: Sparkles,
  title: "A magia acontece",
  description: "Como num passe de mágica, sua lembrança vira arte."
}, {
  number: 3,
  icon: Download,
  title: "Receba sua arte",
  description: "Receba seu desenho digital na hora e imprima sempre que quiser."
}, {
  number: 4,
  icon: Palette,
  title: "Pinte ou presenteie",
  description: "Dê vida ao desenho ou compartilhe a memória com alguém especial."
}];
const HowItWorksStep = ({
  step,
  index
}: {
  step: typeof steps[0];
  index: number;
}) => {
  const isMobile = useIsMobile();
  const {
    ref: centerRef,
    isInCenter
  } = useCenterAlignment();
  const Icon = step.icon;
  return <div ref={centerRef} className="text-center group animate-fade-in-up" style={{
    animationDelay: `${index * 200}ms`,
    animationFillMode: 'forwards'
  }}>
      {/* Número */}
      <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-black mb-6 transition-all duration-300 ${isMobile && isInCenter ? 'border-pink-500 shadow-lg -translate-y-1 bg-pink-50' : !isMobile ? 'group-hover:border-pink-500 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-pink-50' : ''}`}>
        <span className="text-xl font-bold">{step.number}</span>
      </div>

      {/* Ícone */}
      <div className="mb-4">
        <Icon className={`w-12 h-12 mx-auto transition-colors duration-300 ${isMobile && isInCenter ? 'text-pink-500' : !isMobile ? 'text-gray-600 group-hover:text-pink-500' : 'text-gray-600'}`} />
      </div>

      {/* Conteúdo */}
      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
      <p className="text-gray-600 leading-relaxed">{step.description}</p>
    </div>;
};
const HowItWorksSection = () => {
  const {
    ref: sectionRef,
    hasIntersected
  } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px'
  });
  return <section ref={sectionRef} className="px-4 py-[40px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-5xl">
            Como{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Funciona</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Simples, rápido e mágico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => <HowItWorksStep key={step.number} step={step} index={index} />)}
        </div>

        {/* Linha conectora */}
        <div className="hidden lg:block relative mt-16">
          
          
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;
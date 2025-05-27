
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from 'lucide-react';

const faqItems = [
  {
    question: "Quanto tempo leva para receber meu desenho?",
    answer: "A transformação ocorre em tempo real! Em poucos minutos sua foto se torna um desenho pronto para baixar."
  },
  {
    question: "Que tipos de fotos funcionam melhor?",
    answer: (
      <div className="space-y-3">
        <p className="text-gray-600 italic mb-4">
          "Se a foto parece uma lembrança mágica pra você, a arte também vai ser."
        </p>
        <div className="space-y-2">
          {[
            "Momentos especiais e memoráveis (Viagens, casamentos, passeios, encontros...)",
            "Formato vertical (retrato) (Se adapta perfeitamente ao livro de colorir)",
            "Cenário rico e visível (Paisagens, ambientes temáticos, quartos decorados...)",
            "Personagens inteiros no quadro (Evita cortes estranhos, melhora o resultado)",
            "Imagem nítida e bem iluminada (Evita distorções e traços confusos)"
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Você paga apenas por cada imagem que deseja liberar em alta qualidade. Sem assinaturas ou taxas escondidas."
  },
  {
    question: "Posso compartilhar meu desenho nas redes sociais?",
    answer: "Claro! Adoramos ver nossos clientes compartilhando suas criações. Use a hashtag #Colora para que possamos encontrar."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Tire suas dúvidas sobre nosso serviço
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-black p-8 hover:border-transparent hover:shadow-lg transition-all duration-300">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="text-gray-700 leading-relaxed">
                    {typeof item.answer === 'string' ? item.answer : item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

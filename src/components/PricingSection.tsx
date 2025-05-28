import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const packages = [{
  id: 'mini',
  name: 'Pacote Mini',
  credits: 1,
  pricePerCredit: 5,
  totalPrice: 5,
  description: 'Perfeito para transformar sua arte em um cartão inesquecível ou um presente de moldura.',
  note: 'Economize 20% comprando pacote "Plus"',
  isPopular: false
}, {
  id: 'plus',
  name: 'Pacote Plus',
  credits: 12,
  pricePerCredit: 4,
  totalPrice: 48,
  description: 'Ideal para criar uma sequência de memórias — como uma linha do tempo ou mural de fotos',
  note: 'Economize 40% comprando pacote "Max"',
  isPopular: false
}, {
  id: 'max',
  name: 'Pacote Max',
  credits: 24,
  pricePerCredit: 3,
  totalPrice: 72,
  description: 'A escolha perfeita para montar um álbum completo, livro personalizado ou caixa de memórias',
  note: 'Melhor custo benefício!',
  isPopular: true
}];
const PricingSection = () => {
  const [selectedPackage, setSelectedPackage] = useState('plus');
  return <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            1 Crédito = 1 Desenho pra{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Colorir
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Transforme memórias em arte por apenas
          </p>
        </div>

        {/* Toggle de pacotes */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-white p-1 shadow-lg border">
            {packages.map(pkg => <button key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedPackage === pkg.id ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}>
                {pkg.name.split(' ')[1]}
              </button>)}
          </div>
        </div>

        {/* Card do pacote selecionado */}
        <div className="max-w-md mx-auto">
          {packages.map(pkg => {
          if (pkg.id !== selectedPackage) return null;
          return <div key={pkg.id} className="relative bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {pkg.isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-1.5 text-sm font-medium">
                    Melhor custo benefício!
                  </Badge>}

                {/* 1. Nome do pacote */}
                <div className="text-center mb-6">
                  <h3 className="text-gray-900 text-3xl font-extrabold">{pkg.name}</h3>
                </div>

                {/* 2. Descrição */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 leading-relaxed text-base">
                    {pkg.description}
                  </p>
                </div>

                {/* 3. Preço Total / Preço por imagem - DESTACADO */}
                <div className="text-center mb-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-100">
                  <div className="mb-3">
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-3 rounded-none">
                      R$ {pkg.totalPrice.toFixed(2)}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-pink-600">R${pkg.pricePerCredit}</span>
                      <span className="text-gray-600 text-lg">por imagem</span>
                      {pkg.pricePerCredit < 5 && <span className="text-gray-400 line-through text-base">R$5</span>}
                    </div>
                  </div>
                  
                  {/* Quantidade de Créditos no Pacote - Movido para baixo do preço */}
                  <div className="pt-3 border-t border-pink-200">
                    <span className="text-lg font-semibold text-gray-700">
                      {pkg.credits} Crédito{pkg.credits > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* 4. Nota discreta - Próxima do botão CTA */}
                {pkg.note && <div className="text-center mb-4">
                    <p className={`text-sm ${pkg.isPopular ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {pkg.note}
                    </p>
                  </div>}

                {/* 5. Botão CTA */}
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 rounded-full text-lg font-semibold mb-6 h-auto">
                  Transforme sua foto antes de Pagar
                </Button>

                {/* 6. Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 cursor-help hover:text-gray-700 transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        <span>Por que escolher nosso serviço?</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center">
                        Utilizamos a GPT-image-1, a melhor IA geradora de imagens da atualidade
                        <br />
                        (economia de R$115/mês do GPT Plus)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>;
        })}
        </div>
      </div>
    </section>;
};
export default PricingSection;
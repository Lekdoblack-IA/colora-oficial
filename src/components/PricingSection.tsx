import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  isPopular: true
}, {
  id: 'max',
  name: 'Pacote Max',
  credits: 24,
  pricePerCredit: 3,
  totalPrice: 72,
  description: 'A escolha perfeita para montar um álbum completo, livro personalizado ou caixa de memórias',
  note: 'Melhor custo benefício!',
  isPopular: false
}];
const PricingSection = () => {
  const [selectedPackage, setSelectedPackage] = useState('plus');
  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  return <section className="px-4 bg-gray-50 py-[40px]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-5xl">
            1 Crédito = 1 Desenho pra{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Colorir
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Transforme memórias em arte por apenas
          </p>
        </div>

        {/* Card único com design da referência */}
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header com gradiente e quantidade de créditos */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-center py-4">
              <h3 className="text-lg font-medium">
                {selectedPkg?.credits} {selectedPkg?.credits === 1 ? 'Desenho' : 'Desenhos'}
              </h3>
            </div>

            {/* Conteúdo do card */}
            <div className="p-8 text-center flex flex-col items-center">
              {/* Nome do pacote */}
              <h2 className="font-bold text-gray-900 mb-3 text-3xl">
                {selectedPkg?.name}
              </h2>

              {/* Descrição */}
              <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-xs">
                {selectedPkg?.description}
              </p>

              {/* Toggle de pacotes dentro do card */}
              <div className="mb-6 flex justify-center">
                <ToggleGroup type="single" value={selectedPackage} onValueChange={value => value && setSelectedPackage(value)} className="inline-flex rounded-full bg-gray-100 p-1">
                  {packages.map(pkg => <ToggleGroupItem key={pkg.id} value={pkg.id} className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-pink-500 data-[state=on]:to-red-500 data-[state=on]:text-white data-[state=on]:shadow-md text-gray-600 hover:text-gray-900">
                      {pkg.name.split(' ')[1]}
                    </ToggleGroupItem>)}
                </ToggleGroup>
              </div>

              {/* Preço centralizado */}
              <div className="mb-2 flex items-center justify-center">
                <span className="text-pink-500 mr-1 font-bold text-2xl">R$</span>
                <span className="font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent text-6xl">
                  {selectedPkg?.totalPrice}
                </span>
              </div>

              {/* Preço por crédito centralizado */}
              <p className="text-pink-500 text-base font-medium mb-8 py-[15px]">
                Apenas {selectedPkg?.pricePerCredit} Reais por imagem!
              </p>

              {/* Botão CTA centralizado */}
              <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full font-semibold mb-4 h-auto text-base px-0 py-[17px]">
                Transforme sua foto antes de Pagar
              </Button>

              {/* Nota em verde */}
              {selectedPkg?.note && <p className="text-sm text-green-600 font-medium">
                  {selectedPkg.note}
                </p>}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PricingSection;
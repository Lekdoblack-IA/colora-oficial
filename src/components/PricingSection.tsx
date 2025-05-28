
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  
  return (
    <section className="py-20 px-4 bg-gray-50">
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
            {packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {pkg.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Card do pacote selecionado */}
        <div className="max-w-sm mx-auto">
          {packages.map(pkg => {
            if (pkg.id !== selectedPackage) return null;
            
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
                {/* Header com gradiente e quantidade de créditos */}
                <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-center py-4">
                  <h3 className="text-xl font-semibold">
                    {pkg.credits} {pkg.credits === 1 ? 'Crédito' : 'Créditos'}
                  </h3>
                </div>

                {/* Conteúdo do card */}
                <div className="p-8 text-center">
                  {/* Nome do pacote */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {pkg.name}
                  </h2>

                  {/* Descrição */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Preço */}
                  <div className="mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                      R$ {pkg.totalPrice}
                    </span>
                  </div>

                  {/* Preço por crédito */}
                  <p className="text-pink-500 text-lg font-medium mb-8">
                    Apenas {pkg.pricePerCredit} Reais por imagem!
                  </p>

                  {/* Botão CTA */}
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 rounded-full text-lg font-semibold mb-4 h-auto">
                    Transforme sua foto antes de Pagar
                  </Button>

                  {/* Nota */}
                  {pkg.note && (
                    <p className={`text-sm ${
                      pkg.isPopular ? 'text-green-600 font-medium' : 'text-gray-500'
                    }`}>
                      {pkg.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

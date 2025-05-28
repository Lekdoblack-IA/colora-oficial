import { Star, Heart } from 'lucide-react';
const testimonials = [{
  id: 1,
  name: "Maria Silva",
  relationship: "Namorada há 2 anos",
  text: "Transformei nossa primeira foto juntos em um desenho lindo! Meu namorado ficou emocionado quando dei de presente. É uma lembrança que vamos guardar para sempre.",
  rating: 5,
  image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=64&h=64&fit=crop&crop=face"
}, {
  id: 2,
  name: "João Santos",
  relationship: "Pai de família",
  text: "Fiz um álbum inteiro com fotos da família! As crianças adoraram colorir e agora temos uma atividade especial para fazer juntos nos fins de semana.",
  rating: 5,
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
}, {
  id: 3,
  name: "Ana Costa",
  relationship: "Recém-casada",
  text: "Usei nas nossas fotos de casamento e ficou perfeito! Criamos um livro personalizado para os convidados colorarem na festa. Foi um sucesso total!",
  rating: 5,
  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
}];
const TestimonialsSection = () => {
  return <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500">10.000+</div>
              <div className="text-gray-600">Desenhos Criados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">1.485+</div>
              <div className="text-gray-600">Clientes Felizes</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 md:text-5xl">
            O que nossos{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              clientes dizem
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={testimonial.id} className="bg-white rounded-3xl border border-black p-6 hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{
          animationDelay: `${index * 0.2}s`
        }}>
              {/* Avaliação */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
              </div>

              {/* Depoimento */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Autor */}
              <div className="flex items-center space-x-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold flex items-center space-x-1">
                    <span>{testimonial.name}</span>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                  <div className="text-gray-500 text-sm">{testimonial.relationship}</div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;
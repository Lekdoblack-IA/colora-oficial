export const LimitReachedState = () => {
  return <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Transformar Nova Imagem
        </h2>
        <div className="border border-red-200 rounded-lg p-6 bg-[#ffecec]">
          <p className="text-yellow-800 font-medium">
            Limite de imagens atingido
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            Você pode ter no máximo 2 imagens não pagas simultaneamente. 
            Desbloqueie uma imagem existente para continuar.
          </p>
        </div>
      </div>
    </section>;
};
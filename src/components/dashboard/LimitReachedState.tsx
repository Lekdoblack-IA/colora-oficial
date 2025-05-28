export const LimitReachedState = () => {
  return <section className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Transformar Nova Imagem
        </h2>
        <div className="border border-red-200 rounded-lg p-6 bg-[#ffecec]">
          <p className="font-medium text-red-800">
            Limite de imagens atingido
          </p>
          <p className="text-sm mt-1 text-red-600">
            Você pode ter no máximo 2 imagens não pagas simultaneamente. 
            Desbloqueie uma imagem existente para continuar.
          </p>
        </div>
      </div>
    </section>;
};
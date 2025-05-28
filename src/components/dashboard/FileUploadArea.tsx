
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
}

export const FileUploadArea = ({ onFileSelect }: FileUploadAreaProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={e => e.preventDefault()} 
      onClick={() => document.getElementById('file-input')?.click()} 
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-12 lg:py-[55px] lg:px-[55px] text-center hover:border-pink-400 transition-colors cursor-pointer"
    >
      <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4" />
      <p className="text-base md:text-lg font-medium text-gray-900 mb-2">
        Selecione uma imagem
      </p>
      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
        Arraste e solte ou clique para selecionar
      </p>
      <p className="text-xs md:text-sm text-gray-500">
        Formatos aceitos: JPG, PNG (até 15MB)
      </p>
      <input 
        id="file-input" 
        type="file" 
        accept="image/jpeg,image/png" 
        className="hidden" 
        onChange={handleFileInput} 
      />
    </div>
  );
};


import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Star } from 'lucide-react';

interface TransformImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransform: (file: File) => void;
  userCredits: number;
}

export const TransformImageModal = ({ isOpen, onClose, onTransform, userCredits }: TransformImageModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleTransform = () => {
    if (selectedFile && userCredits > 0) {
      onTransform(selectedFile);
      setSelectedFile(null);
      setPreview('');
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreview('');
    setIsDragging(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Transformar Imagem
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Credits Display */}
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-3 rounded-lg">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="font-medium">Você tem {userCredits} créditos disponíveis</span>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            {preview ? (
              <div className="space-y-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview('');
                  }}
                >
                  Escolher outra imagem
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-full">
                    <ImageIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Escolha uma imagem para transformar
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Arraste e solte ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar Arquivo
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Transform Button */}
          <Button
            onClick={handleTransform}
            disabled={!selectedFile || userCredits <= 0}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:opacity-50"
          >
            {userCredits <= 0 
              ? 'Sem créditos disponíveis' 
              : selectedFile 
                ? 'Transformar Imagem (1 crédito)' 
                : 'Selecione uma imagem'
            }
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Formatos aceitos: JPG, PNG, GIF • Tamanho máximo: 10MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

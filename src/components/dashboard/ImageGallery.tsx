
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Loader2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface UserImage {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  title: string;
}

interface ImageGalleryProps {
  images: UserImage[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'transformed'>('transformed');

  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `colora-${fileName}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (images.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <div className="text-gray-400 mb-4">
            <Eye className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma imagem ainda
          </h3>
          <p className="text-gray-600">
            Suas imagens transformadas aparecerão aqui após o processamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={image.status === 'completed' ? image.transformedUrl : image.originalUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Overlay */}
                <div className="absolute top-2 left-2">
                  {image.status === 'processing' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processando
                    </Badge>
                  )}
                  {image.status === 'completed' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Concluído
                    </Badge>
                  )}
                  {image.status === 'failed' && (
                    <Badge variant="destructive">
                      ✗ Falhou
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                {image.status === 'completed' && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => handleDownload(image.transformedUrl, image.title)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {image.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(image.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogTitle className="text-xl font-bold text-center mb-4">
              {selectedImage.title}
            </DialogTitle>
            
            <div className="space-y-4">
              {/* Toggle Buttons */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant={viewMode === 'original' ? 'default' : 'outline'}
                  onClick={() => setViewMode('original')}
                >
                  Imagem Original
                </Button>
                <Button
                  variant={viewMode === 'transformed' ? 'default' : 'outline'}
                  onClick={() => setViewMode('transformed')}
                >
                  Imagem Transformada
                </Button>
              </div>

              {/* Image Display */}
              <div className="flex justify-center">
                <img
                  src={viewMode === 'original' ? selectedImage.originalUrl : selectedImage.transformedUrl}
                  alt={`${viewMode} - ${selectedImage.title}`}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => handleDownload(
                    viewMode === 'original' ? selectedImage.originalUrl : selectedImage.transformedUrl,
                    `${viewMode}-${selectedImage.title}`
                  )}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar {viewMode === 'original' ? 'Original' : 'Transformada'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

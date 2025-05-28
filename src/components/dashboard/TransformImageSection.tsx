
import { useImageTransform } from '@/hooks/useImageTransform';
import { FileUploadArea } from './FileUploadArea';
import { ProcessingState } from './ProcessingState';
import { ImagePreview } from './ImagePreview';
import { LimitReachedState } from './LimitReachedState';

interface TransformImageSectionProps {
  onImageTransformed: (originalUrl: string, transformedUrl: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  canTransform: boolean;
}

export const TransformImageSection = ({
  onImageTransformed,
  isProcessing,
  setIsProcessing,
  canTransform
}: TransformImageSectionProps) => {
  const {
    selectedImage,
    previewUrl,
    currentMessageIndex,
    processingMessages,
    handleFileSelect,
    handleCancel,
    handleTransform
  } = useImageTransform(onImageTransformed, isProcessing, setIsProcessing);

  if (!canTransform) {
    return <LimitReachedState />;
  }

  if (isProcessing) {
    return (
      <ProcessingState 
        currentMessage={processingMessages[currentMessageIndex]} 
        currentIndex={currentMessageIndex} 
        totalMessages={processingMessages.length} 
      />
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 md:p-8 lg:py-[70px] lg:px-[70px] shadow-sm">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-bold text-gray-900 mb-2 text-xl md:text-2xl lg:text-3xl">
          Transformar Nova Imagem
        </h2>
      </div>

      {!selectedImage ? (
        <FileUploadArea onFileSelect={handleFileSelect} />
      ) : (
        <ImagePreview 
          previewUrl={previewUrl!} 
          fileName={selectedImage.name} 
          onCancel={handleCancel} 
          onTransform={handleTransform} 
        />
      )}
    </section>
  );
};

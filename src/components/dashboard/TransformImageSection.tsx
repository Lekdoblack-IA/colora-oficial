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
    return <ProcessingState currentMessage={processingMessages[currentMessageIndex]} currentIndex={currentMessageIndex} totalMessages={processingMessages.length} />;
  }
  return <section className="bg-white rounded-2xl p-8 shadow-sm py-[70px] px-[70px]">
      <div className="text-center mb-8">
        <h2 className="font-bold text-gray-900 mb-2 text-3xl">
          Transformar Nova Imagem
        </h2>
      </div>

      {!selectedImage ? <FileUploadArea onFileSelect={handleFileSelect} /> : <ImagePreview previewUrl={previewUrl!} fileName={selectedImage.name} onCancel={handleCancel} onTransform={handleTransform} />}
    </section>;
};
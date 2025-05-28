
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface TransformButtonProps {
  isVisible: boolean;
  isLoggedIn: boolean;
  onTransformClick: () => void;
}

export const TransformButton = ({ isVisible, isLoggedIn, onTransformClick }: TransformButtonProps) => {
  if (!isVisible) return null;

  const handleClick = () => {
    console.log('Transform button clicked, isLoggedIn:', isLoggedIn);
    onTransformClick();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up p-6" style={{ zIndex: 20 }}>
      <Button 
        onClick={handleClick}
        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-3 text-base rounded-full shadow-lg animate-pulse"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Transforme agora ✨
      </Button>
    </div>
  );
};

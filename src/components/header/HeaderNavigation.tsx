
import { Button } from "@/components/ui/button";
import { UserDropdown } from './UserDropdown';

interface HeaderNavigationProps {
  isLoggedIn: boolean;
  isDashboard: boolean;
  userEmail: string;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onBuyCredits: () => void;
  onGoHome: () => void;
  onGoDashboard: () => void;
}

export const HeaderNavigation = ({
  isLoggedIn,
  isDashboard,
  userEmail,
  onOpenAuthModal,
  onLogout,
  onBuyCredits,
  onGoHome,
  onGoDashboard
}: HeaderNavigationProps) => {
  if (!isLoggedIn) {
    return (
      <Button 
        onClick={onOpenAuthModal} 
        variant="outline" 
        className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200"
      >
        Login
      </Button>
    );
  }

  return (
    <UserDropdown
      isDashboard={isDashboard}
      userEmail={userEmail}
      onLogout={onLogout}
      onBuyCredits={onBuyCredits}
      onGoHome={onGoHome}
      onGoDashboard={onGoDashboard}
    />
  );
};

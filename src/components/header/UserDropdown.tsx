
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Home, LayoutDashboard, CreditCard, Mail } from 'lucide-react';

interface UserDropdownProps {
  onLogout: () => void;
  userCredits: number;
  isDashboard: boolean;
  onGoHome: () => void;
  onGoDashboard: () => void;
  onBuyCredits: () => void;
}

export const UserDropdown = ({ 
  onLogout, 
  userCredits, 
  isDashboard, 
  onGoHome, 
  onGoDashboard, 
  onBuyCredits 
}: UserDropdownProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.name?.slice(0, 2).toUpperCase() || 'U';
  };

  const getProviderIcon = () => {
    switch (user.auth_provider) {
      case 'google':
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'facebook':
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getProviderText = () => {
    switch (user.auth_provider) {
      case 'google':
        return 'Google';
      case 'email':
        return 'Email';
      case 'facebook':
        return 'Facebook';
      default:
        return 'Email';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white border shadow-lg" align="end">
        {/* User Info Section */}
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center mt-1">
                {getProviderIcon()}
                <Badge variant="outline" className="ml-1 text-xs">
                  {getProviderText()}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Navigation Buttons */}
        {isDashboard ? (
          <DropdownMenuItem className="cursor-pointer p-3" onClick={onGoHome}>
            <Home className="mr-3 h-4 w-4" />
            <span className="font-medium">Ir para Início</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer p-3" onClick={onGoDashboard}>
            <LayoutDashboard className="mr-3 h-4 w-4" />
            <span className="font-medium">Ir para Dashboard</span>
          </DropdownMenuItem>
        )}
        
        {/* Credits Button */}
        <DropdownMenuItem className="cursor-pointer p-3" onClick={onBuyCredits}>
          <CreditCard className="mr-3 h-4 w-4" />
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">Créditos</span>
            <Badge variant="secondary" className="ml-2">
              {userCredits}
            </Badge>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Logout Button */}
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 p-3" 
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

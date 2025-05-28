
import { Button } from "@/components/ui/button";
import { User, ChevronDown, LogOut, CreditCard, Home, LayoutDashboard } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  isDashboard: boolean;
  userEmail: string;
  onLogout: () => void;
  onBuyCredits: () => void;
  onGoHome: () => void;
  onGoDashboard: () => void;
}

export const UserDropdown = ({ 
  isDashboard, 
  userEmail, 
  onLogout, 
  onBuyCredits, 
  onGoHome, 
  onGoDashboard 
}: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/90 backdrop-blur-sm hover:bg-white border-gray-200 flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Minha Conta</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Minha Conta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isDashboard ? (
          <DropdownMenuItem onClick={onGoHome}>
            <Home className="mr-2 h-4 w-4" />
            Voltar para o Inicio
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onGoDashboard}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Ir para Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={onBuyCredits}>
          <CreditCard className="mr-2 h-4 w-4" />
          Comprar Créditos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

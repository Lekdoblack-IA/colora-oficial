import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}
export const AuthModal = ({
  isOpen,
  onClose,
  onLogin
}: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleLogin = () => {
    console.log('Login com Google');
    onLogin?.();
    onClose();
  };
  const handleLogin = () => {
    console.log('Login:', {
      email,
      password
    });
    onLogin?.();
    onClose();
  };
  const handleSignup = () => {
    console.log('Cadastro:', {
      name,
      email,
      password,
      confirmPassword
    });
    onLogin?.();
    onClose();
  };
  const handleResetPassword = () => {
    console.log('Recuperar senha:', {
      email
    });
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-white rounded-3xl shadow-2xl overflow-hidden p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-6 text-white text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img src="/lovable-uploads/994f886c-18af-4dbc-8bca-2ad90885a150.png" alt="Colora ♡" className="h-8 w-auto brightness-0 invert" />
          </div>
          <h2 className="text-xl font-bold">Seja Bem-vindo </h2>
          <p className="text-white/90 text-sm">Transforme suas memórias em arte</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-2xl p-1">
              <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Criar Conta
              </TabsTrigger>
              <TabsTrigger value="reset" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Recuperar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <Button onClick={handleGoogleLogin} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Entrar com Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">ou</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-2xl h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Entrar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium">E-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="confirm-password" className="text-gray-700 font-medium">Confirmar Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>
                <Button onClick={handleSignup} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-2xl h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Criar Conta
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reset" className="space-y-4 mt-6">
              <div className="text-center mb-4">
                <Heart className="h-12 w-12 text-pink-500 mx-auto mb-3" />
                <p className="text-gray-600">
                  Insira seu e-mail e enviaremos um link para recuperar sua senha.
                </p>
              </div>
              <div className="relative">
                <Label htmlFor="reset-email" className="text-gray-700 font-medium">E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" />
                </div>
              </div>
              <Button onClick={handleResetPassword} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-2xl h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Enviar link de recuperação
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>;
};
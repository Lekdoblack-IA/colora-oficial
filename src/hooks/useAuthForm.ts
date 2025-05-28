
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuthForm = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLogin = async (formData: LoginForm): Promise<boolean> => {
    if (!validateEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return false;
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      return true;
    } catch (error: any) {
      let errorMessage = "Erro inesperado";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Por favor, confirme seu email antes de fazer login";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (formData: RegisterForm): Promise<boolean> => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome.",
        variant: "destructive"
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return false;
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Colora! Você ganhou 1 crédito gratuito.",
      });
      return true;
    } catch (error: any) {
      let errorMessage = "Erro inesperado";
      
      if (error.message.includes('User already registered')) {
        errorMessage = "Este email já está cadastrado";
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    isSubmitting
  };
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Salvar usuário no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular API call - remover quando integrar com Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se é um usuário existente no localStorage
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        // Usuário existente - usar créditos salvos
        const userData: User = {
          id: existingUser.id,
          email,
          name: existingUser.name,
          credits: existingUser.credits
        };
        setUser(userData);
      } else {
        // Simular resposta da API para usuário não cadastrado localmente
        const userData: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          credits: 0 // Usuários fazendo login não ganham créditos iniciais
        };
        setUser(userData);
      }
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular API call - remover quando integrar com Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar novo usuário com 1 crédito inicial
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        credits: 1 // NOVO USUÁRIO GANHA 1 CRÉDITO GRATUITO
      };

      // Salvar na lista de usuários registrados para controle local
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const newUserRecord = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        credits: userData.credits
      };
      existingUsers.push(newUserRecord);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      setUser(userData);
    } catch (error) {
      throw new Error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits };
      setUser(updatedUser);
      
      // Atualizar também na lista de usuários registrados
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const updatedUsers = existingUsers.map((u: any) => 
        u.email === user.email ? { ...u, credits } : u
      );
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

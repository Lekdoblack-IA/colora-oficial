
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  google_id?: string;
  locale?: string;
  verified_email?: boolean;
  last_login_at?: string;
  login_count?: number;
  auth_provider?: 'google' | 'email' | 'facebook';
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userMetadata: any) => Promise<void>;
  logout: () => Promise<void>;
  updateCredits: (credits: number) => void;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar perfil do usuário na tabela profiles com todos os campos incluindo auth_provider
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          credits,
          avatar_url,
          first_name,
          last_name,
          google_id,
          locale,
          verified_email,
          last_login_at,
          login_count,
          auth_provider
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email || session?.user?.email || '',
        name: data.name,
        credits: data.credits,
        avatar_url: data.avatar_url,
        first_name: data.first_name,
        last_name: data.last_name,
        google_id: data.google_id,
        locale: data.locale,
        verified_email: data.verified_email,
        last_login_at: data.last_login_at,
        login_count: data.login_count,
        auth_provider: data.auth_provider
      };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;

        setSession(session);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          // Usar setTimeout para evitar deadlock no callback
          setTimeout(async () => {
            if (mounted) {
              const userProfile = await fetchUserProfile(session.user.id);
              if (mounted) {
                setUser(userProfile);
                setIsLoading(false);
              }
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setIsLoading(false);
          return;
        }

        if (currentSession && mounted) {
          setSession(currentSession);
          const userProfile = await fetchUserProfile(currentSession.user.id);
          if (mounted) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // O listener de auth vai lidar com a atualização do usuário
      console.log('Login realizado com sucesso:', data);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, userMetadata: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('Registro realizado com sucesso:', data);
      // O listener de auth vai lidar com a atualização do usuário
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateCredits = async (credits: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar créditos:', error);
        return;
      }

      // Atualizar estado local
      setUser({ ...user, credits });
    } catch (error) {
      console.error('Erro ao atualizar créditos:', error);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'openid email profile'
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      login,
      register,
      logout,
      updateCredits,
      resetPassword,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

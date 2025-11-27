import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verifica se já tem sessão salva ao abrir o site
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    // 2. Escuta login/logout em tempo real
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Função de Login
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  // Função de Cadastro
  const register = async (data) => {
    const { error } = await supabase.auth.signUp(
      { email: data.email, password: data.password },
      {
        data: {
          full_name: data.name,
          phone: data.phone || null,
          avatar_url: data.avatar || null,
          role: data.type || "adotante",
        },
      }
    );

    if (error) throw error;
  };
  // Função de Logout
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso
export const useAuth = () => useContext(AuthContext);

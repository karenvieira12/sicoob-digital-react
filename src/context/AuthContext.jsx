import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loadingGlobal, setLoadingGlobal] = useState(true); // Item 2: Loading global

  //  Persistência (Verifica se já tinha alguém logado ao abrir o site)
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@Sicoob:usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    setLoadingGlobal(false);
  }, []);

  async function realizarLogin(email, senha) {
    //  Erro de API e Login (Try/Catch)
    try {
      const response = await api.get('/usuarios');
      const user = response.data.find(u => u.email === email && u.senha === senha);

      if (user) {
        setUsuarioLogado(user);
        localStorage.setItem('@Sicoob:usuario', JSON.stringify(user));
        return { sucess: true };
      } else {
        return { sucess: false, message: "E-mail ou senha incorretos!" };
      }
    } catch (error) {
      // Item 1: Erro de API (Server Offline)
      return { sucess: false, message: "Servidor fora do ar. Tente mais tarde." };
    }
  }

  function realizarLogout() {
    setUsuarioLogado(null);
    localStorage.removeItem('@Sicoob:usuario');
  }

  return (
    <AuthContext.Provider value={{ usuarioLogado, realizarLogin, realizarLogout, loadingGlobal }}>
      {children}
    </AuthContext.Provider>
  );
}

// Item 4: O Hook Customizado (Maturidade Absurda)
export function useAuth() {
  return useContext(AuthContext);
}
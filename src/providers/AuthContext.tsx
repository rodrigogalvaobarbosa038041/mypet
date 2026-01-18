import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Api } from './Api';
import { showError, showSuccess, devLog } from '../utils/errorHandler';

// Definindo os tipos
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  userId: string | null;
  userName: string | null;
  token: string | null;
  refreshToken: string | null;
  refreshTokenIfNeeded: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('tokenExpiry');
    setToken(null);
    setRefreshToken(null);
    setUserId(null);
    setUserName(null);
    setIsAuthenticated(false);
  };
  
  // Use effect to check token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (storedToken && storedUserId && storedUserName) {
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUserName(storedUserName);
          setIsAuthenticated(true);
        } else {
          logout(); // Se o token for inválido ou expirado, faça logout
        }
      } catch (error) {
        devLog('Erro ao decodificar o token', error);
        logout();
      }
    } else {
      setIsAuthenticated(false); // Se não houver token, a autenticação é inválida
    }
    setIsLoading(false); // Atualiza quando a verificação de autenticação for concluída
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Mostra um carregamento até a verificação ser feita
  }

  const login = async (username: string, password: string) => {
    try {
      // Fazendo a requisição POST para a nova API
      const response = await Api.post('autenticacao/login', {
        username,
        password,
      });
  
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data;

        // Guardando os tokens no localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('tokenExpiry', (Date.now() + (expires_in * 1000)).toString());
        
        // Extraindo informações do token JWT (se necessário)
        try {
          const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
          const userId = decodedToken.sub || decodedToken.userId || '';
          const userName = decodedToken.name || decodedToken.username || username;
          
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName);
          
          setUserId(userId);
          setUserName(userName);
        } catch (decodeError) {
          devLog('Erro ao decodificar o token no login', decodeError);
          // Se não conseguir decodificar, usa o username como userName
          localStorage.setItem('userId', username);
          localStorage.setItem('userName', username);
          
          setUserId(username);
          setUserName(username);
        }
        
        setToken(access_token);
        setRefreshToken(refresh_token);
        setIsAuthenticated(true);
      } else {
        showSuccess('Login realizado com sucesso!');
      }
    } catch (error: any) {
      devLog('Erro no login', error);
      if (error.response?.status === 400) {
        showError('Credenciais inválidas. Verifique seu usuário e senha.');
      } else {
        showError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
      }
    }
  };

  // Função para verificar se o token está expirado
  const isTokenExpired = (): boolean => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return true;
    return Date.now() >= parseInt(tokenExpiry);
  };

  // Função para refresh do token
  const refreshTokenRequest = async (): Promise<boolean> => {
    if (isRefreshing) return false;
    
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
      logout();
      return false;
    }

    setIsRefreshing(true);
    try {
      const response = await Api.put('autenticacao/refresh', {
        refresh_token: currentRefreshToken
      });

      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;
        
        // Atualizando tokens
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('tokenExpiry', (Date.now() + (expires_in * 1000)).toString());
        
        setToken(access_token);
        setRefreshToken(refresh_token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      devLog('Erro ao fazer refresh do token', error);
      logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Função pública para refresh quando necessário
  const refreshTokenIfNeeded = async (): Promise<boolean> => {
    if (!token || isTokenExpired()) {
      return await refreshTokenRequest();
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, userName, token, refreshToken, refreshTokenIfNeeded }}>
      {children}
    </AuthContext.Provider>
  );
};

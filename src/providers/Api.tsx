import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

// Criação da instância do Axios
const Api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
});

// Flag para evitar múltiplos refresh simultâneos
let isRefreshing = false;
let failedQueue: any[] = [];

// Processa a fila de requisições falhadas
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para adicionar o token Bearer em todas as requisições
Api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Interceptor para response - trata erros 401 e faz refresh automático
Api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Se já está fazendo refresh, adiciona à fila
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return Api(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          processQueue(new Error('No refresh token available'));
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          const response = await axios.put(`${baseURL}autenticacao/refresh`, {
            refresh_token: refreshToken
          });

          if (response.status === 200) {
            const { access_token, refresh_token, expires_in } = response.data;
            
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('tokenExpiry', (Date.now() + (expires_in * 1000)).toString());
            
            processQueue(null, access_token);
            
            // Atualiza o header da requisição original e refaz a chamada
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return Api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
);
  
export { Api };

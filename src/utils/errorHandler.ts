// Funções simples de tratamento de erros usando alert nativo
// Pode ser migrado para react-toastify no futuro

export const showSuccess = (message: string) => {
  console.log('✅ Success:', message);
  // Temporariamente usando alert até configurar toast
  alert(`✅ ${message}`);
};

export const showError = (message: string) => {
  console.error('❌ Error:', message);
  alert(`❌ ${message}`);
};

export const showWarning = (message: string) => {
  console.warn('⚠️ Warning:', message);
  alert(`⚠️ ${message}`);
};

export const showInfo = (message: string) => {
  console.info('ℹ️ Info:', message);
  alert(`ℹ️ ${message}`);
};

// Tratamento de erros de API
export const handleApiError = (error: any, defaultMessage = 'Ocorreu um erro inesperado') => {
  console.error('API Error:', error);
  
  if (error?.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        showError(message || 'Dados inválidos. Verifique as informações enviadas.');
        break;
      case 401:
        showError('Sessão expirada. Faça login novamente.');
        break;
      case 403:
        showError('Você não tem permissão para realizar esta ação.');
        break;
      case 404:
        showError('Recurso não encontrado.');
        break;
      case 500:
        showError('Erro interno do servidor. Tente novamente mais tarde.');
        break;
      default:
        showError(message || defaultMessage);
    }
  } else if (error?.request) {
    showError('Erro de conexão. Verifique sua internet.');
  } else {
    showError(defaultMessage);
  }
};

// Log apenas em desenvolvimento
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] ${message}`, data);
  }
};

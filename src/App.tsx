import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

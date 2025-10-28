import { useAuth } from '../../context/AuthContext';
import { Navigate,Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth(); // Obtiene el estado de autenticación
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Importa jwt-decode para manejar el token

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [userId, setUserId] = useState(null); // Estado para el ID del usuario
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const SESSION_TIMEOUT = 150 * 60 * 1000; // 15 minutos en milisegundos
  let timeoutId;

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    extractUserIdFromToken(); // Extraer el ID del usuario del token al iniciar sesión
    startInactivityTimer();
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('token');
    setUserId(null); // Limpiar el ID del usuario al cerrar sesión
    navigate('/login');
  };

  const startInactivityTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      console.log('Tu sesión ha expirado por inactividad.');
      logout();
    }, SESSION_TIMEOUT);
  };

  const resetInactivityTimer = () => {
    clearTimeout(timeoutId);
    startInactivityTimer();
  };

  // Extraer el ID del usuario del token
  const extractUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decodificar el token JWT
        setUserId(decoded.user_id); // Extraer y almacenar el ID del usuario
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      extractUserIdFromToken(); // Extraer el ID del usuario al montar el contexto si está logueado
      startInactivityTimer();
    }

    // Listeners de actividad del usuario
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('touchstart', resetInactivityTimer);
    window.addEventListener('touchend', resetInactivityTimer);
    window.addEventListener('touchmove', resetInactivityTimer);

    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      window.removeEventListener('touchstart', resetInactivityTimer);
      window.removeEventListener('touchend', resetInactivityTimer);
      window.removeEventListener('touchmove', resetInactivityTimer);
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('loggedIn') === 'true');
      if (isLoggedIn) {
        extractUserIdFromToken(); // Extraer el ID del usuario si cambia el almacenamiento
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, sidebarOpen, setSidebarOpen, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

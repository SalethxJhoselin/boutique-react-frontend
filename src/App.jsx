import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import MyRoutes from './routes/Routes'; //modifique esto a Routes de routes
import Sidebar from './components/Layout/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const AppContent = () => {
  const { isLoggedIn, sidebarOpen, setSidebarOpen } = useAuth();

  return (
    <div className="flex h-screen bg-white transition-all duration-300">
      {isLoggedIn && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="pt-16">
          <MyRoutes />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

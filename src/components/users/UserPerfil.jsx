import { useEffect, useState } from 'react';
import api from '../../api/apiServices'; // Importa tu instancia de Axios para las solicitudes
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { userId } = useAuth(); // Acceder al ID del usuario desde el contexto
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/usuarios/${userId}/`); // Realiza la solicitud al endpoint del usuario
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      {userData ? (
        <>
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Roles:</strong> {userData.roles.join(', ')}</p>
        </>
      ) : (
        <p>No se encontraron datos del usuario.</p>
      )}
    </div>
  );
};

export default UserProfile;

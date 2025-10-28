import { useEffect, useState } from 'react';
import api from '../../api/apiServices';
import { useAuth } from '../../context/AuthContext';

// Mocks de datos para desarrollo
const MOCK_USERS = {
  1: {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    roles: [2],
    telefono: "+34 612 345 678",
    fecha_registro: "2024-01-15",
    direccion: "Calle Principal 123, Madrid",
    preferencias: ["deportes", "tecnología"]
  },
  2: {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@ejemplo.com",
    roles: [2],
    telefono: "+34 623 456 789",
    fecha_registro: "2024-02-20",
    direccion: "Avenida Central 456, Barcelona",
    preferencias: ["moda", "viajes"]
  },
  3: {
    id: 3,
    nombre: "Admin Sistema",
    email: "admin@ejemplo.com",
    roles: [1, 2],
    telefono: "+34 634 567 890",
    fecha_registro: "2024-01-01",
    direccion: "Plaza Mayor 789, Valencia",
    preferencias: ["todos"]
  }
};

const MOCK_ERROR_RESPONSES = {
  not_found: {
    error: "Usuario no encontrado",
    message: "El usuario solicitado no existe en el sistema"
  },
  unauthorized: {
    error: "No autorizado",
    message: "No tienes permisos para ver este perfil"
  }
};

const UserProfile = () => {
  const { userId } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedMockUser, setSelectedMockUser] = useState(1);

  const mockUserData = async (userId, shouldError = false, errorType = 'not_found') => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (shouldError) {
      throw {
        response: {
          data: MOCK_ERROR_RESPONSES[errorType] || MOCK_ERROR_RESPONSES.not_found
        }
      };
    }

    const user = MOCK_USERS[userId];
    if (!user) {
      throw {
        response: {
          data: MOCK_ERROR_RESPONSES.not_found
        }
      };
    }

    return { data: user };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (useMockData) {
          console.log("Usando mock de perfil de usuario");
          const mockUserId = selectedMockUser || userId;
          response = await mockUserData(mockUserId);
        } else {
          response = await api.get(`/usuarios/${userId}/`);
        }

        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        const errorMsg = err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al cargar los datos del usuario.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (userId || useMockData) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('No hay usuario autenticado');
    }
  }, [userId, useMockData, selectedMockUser]);

  // Función para probar diferentes escenarios
  const testScenario = (scenario) => {
    setUseMockData(true);
    setError(null);
    setUserData(null);

    switch (scenario) {
      case 'user1':
        setSelectedMockUser(1);
        break;
      case 'user2':
        setSelectedMockUser(2);
        break;
      case 'admin':
        setSelectedMockUser(3);
        break;
      case 'not_found':
        setSelectedMockUser(999);
        break;
      case 'error':
        // Forzar error en el mock
        const fetchWithError = async () => {
          setLoading(true);
          try {
            await mockUserData(1, true, 'unauthorized');
          } catch (err) {
            setError(err.response?.data?.message || 'Error simulado');
          } finally {
            setLoading(false);
          }
        };
        fetchWithError();
        break;
      default:
        setSelectedMockUser(1);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => setUseMockData(false)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Volver a datos reales
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      {/* Panel de control para desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Usar datos de prueba</span>
            </label>
            {useMockData && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                MOCK
              </span>
            )}
          </div>

          {useMockData && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 mb-2">Escenarios de prueba:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => testScenario('user1')}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Usuario 1
                </button>
                <button
                  type="button"
                  onClick={() => testScenario('user2')}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Usuario 2
                </button>
                <button
                  type="button"
                  onClick={() => testScenario('admin')}
                  className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => testScenario('not_found')}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  No Encontrado
                </button>
                <button
                  type="button"
                  onClick={() => testScenario('error')}
                  className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                >
                  Error
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {useMockData && process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
          <strong>Modo Prueba:</strong> Mostrando perfil mockeado
          {selectedMockUser && ` (Usuario ID: ${selectedMockUser})`}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-800">Perfil de Usuario</h1>

      {userData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-600">ID:</strong>
              <p className="text-gray-800">{userData.id}</p>
            </div>
            <div>
              <strong className="text-gray-600">Nombre:</strong>
              <p className="text-gray-800">{userData.nombre}</p>
            </div>
          </div>

          <div>
            <strong className="text-gray-600">Email:</strong>
            <p className="text-gray-800">{userData.email}</p>
          </div>

          <div>
            <strong className="text-gray-600">Roles:</strong>
            <p className="text-gray-800">{userData.roles?.join(', ') || 'Sin roles'}</p>
          </div>

          {/* Información adicional para mocks */}
          {useMockData && userData.telefono && (
            <div>
              <strong className="text-gray-600">Teléfono:</strong>
              <p className="text-gray-800">{userData.telefono}</p>
            </div>
          )}

          {useMockData && userData.fecha_registro && (
            <div>
              <strong className="text-gray-600">Fecha de Registro:</strong>
              <p className="text-gray-800">{userData.fecha_registro}</p>
            </div>
          )}

          {useMockData && userData.direccion && (
            <div>
              <strong className="text-gray-600">Dirección:</strong>
              <p className="text-gray-800">{userData.direccion}</p>
            </div>
          )}

          {useMockData && userData.preferencias && (
            <div>
              <strong className="text-gray-600">Preferencias:</strong>
              <p className="text-gray-800">{userData.preferencias.join(', ')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron datos del usuario.</p>
          {process.env.NODE_ENV === 'development' && !useMockData && (
            <button
              onClick={() => setUseMockData(true)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Probar con datos de prueba
            </button>
          )}
        </div>
      )}

      {/* Información de usuarios mock en desarrollo */}
      {process.env.NODE_ENV === 'development' && useMockData && (
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <p className="font-semibold mb-2">Usuarios mock disponibles:</p>
          <ul className="space-y-1">
            {Object.entries(MOCK_USERS).map(([id, user]) => (
              <li key={id}>
                <strong>ID {id}:</strong> {user.nombre} ({user.email}) - Roles: [{user.roles.join(', ')}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
import { Button, Checkbox, Select, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Title } = Typography;

// Mocks de datos para desarrollo
const MOCK_ROLES = [
    {
        id: 1,
        nombre: "Administrador",
        descripcion: "Acceso completo al sistema",
        permisos: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 2,
        nombre: "Moderador",
        descripcion: "Puede gestionar contenido y usuarios",
        permisos: [2, 3, 4, 6]
    },
    {
        id: 3,
        nombre: "Usuario",
        descripcion: "Usuario estándar del sistema",
        permisos: [4, 6]
    },
    {
        id: 4,
        nombre: "Invitado",
        descripcion: "Acceso limitado de solo lectura",
        permisos: [6]
    }
];

const MOCK_PERMISSIONS = [
    {
        id: 1,
        nombre: "Gestionar Usuarios",
        descripcion: "Crear, editar y eliminar usuarios",
        categoria: "Administración"
    },
    {
        id: 2,
        nombre: "Gestionar Roles",
        descripcion: "Asignar y modificar roles del sistema",
        categoria: "Administración"
    },
    {
        id: 3,
        nombre: "Gestionar Contenido",
        descripcion: "Moderar y administrar contenido",
        categoria: "Moderación"
    },
    {
        id: 4,
        nombre: "Ver Reportes",
        descripcion: "Acceso a reportes y estadísticas",
        categoria: "Reportes"
    },
    {
        id: 5,
        nombre: "Configuración Sistema",
        descripcion: "Modificar configuraciones del sistema",
        categoria: "Administración"
    },
    {
        id: 6,
        nombre: "Acceso Básico",
        descripcion: "Acceso básico a la plataforma",
        categoria: "General"
    }
];

const MOCK_ERROR_RESPONSES = {
    save_error: {
        detail: "Error al guardar los permisos",
        message: "No se pudieron actualizar los permisos del rol"
    },
    load_error: {
        detail: "Error al cargar datos",
        message: "No se pudieron cargar los roles o permisos"
    }
};

const ManagePermissions = () => {
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [useMockData, setUseMockData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Simular llamadas a API con mocks
    const mockApiCall = async (endpoint, data = null, shouldError = false) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        if (shouldError) {
            throw {
                response: {
                    data: MOCK_ERROR_RESPONSES.load_error
                }
            };
        }

        switch (endpoint) {
            case "/roles/":
                return { data: MOCK_ROLES };
            case "/permisos/":
                return { data: MOCK_PERMISSIONS };
            case `/roles/${data?.roleId}/asignar_permisos/`:
                // Simular actualización de permisos
                const updatedRole = {
                    ...MOCK_ROLES.find(role => role.id === data.roleId),
                    permisos: data.permisos
                };
                return { data: { success: true, role: updatedRole } };
            default:
                return { data: [] };
        }
    };

    // Cargar roles y permisos al montar el componente
    useEffect(() => {
        const loadRolesAndPermissions = async () => {
            setIsLoading(true);
            try {
                let rolesData, permissionsData;

                if (useMockData) {
                    console.log("Usando mocks de roles y permisos");
                    rolesData = await mockApiCall("/roles/");
                    permissionsData = await mockApiCall("/permisos/");
                } else {
                    [rolesData, permissionsData] = await Promise.all([
                        api.get("/roles/"),
                        api.get("/permisos/")
                    ]);
                }

                setRoles(rolesData.data);
                setPermissions(permissionsData.data);

                notification.success({
                    message: 'Datos cargados correctamente',
                    description: `Se cargaron ${rolesData.data.length} roles y ${permissionsData.data.length} permisos`
                });
            } catch (error) {
                console.error('Error loading data:', error);
                notification.error({
                    message: 'Error al obtener roles o permisos',
                    description: error.response?.data?.detail || error.message
                });

                // En caso de error, cargar mocks automáticamente
                if (!useMockData) {
                    setUseMockData(true);
                    const loadMockData = async () => {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        setRoles(MOCK_ROLES);
                        setPermissions(MOCK_PERMISSIONS);
                        notification.info({
                            message: 'Usando datos de prueba',
                            description: 'Se cargaron datos mock para desarrollo'
                        });
                    };
                    loadMockData();
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadRolesAndPermissions();
    }, [useMockData]);

    // Manejar cambio de rol
    const handleRoleChange = (value) => {
        setSelectedRoleId(value);
        const selectedRole = roles.find(role => role.id === value);
        setRolePermissions(selectedRole?.permisos || []);
    };

    // Manejar cambio de permisos
    const handlePermissionChange = (permissionId) => {
        setRolePermissions(prevPermissions =>
            prevPermissions.includes(permissionId)
                ? prevPermissions.filter(id => id !== permissionId)
                : [...prevPermissions, permissionId]
        );
    };

    // Agrupar permisos por categoría
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.categoria || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {});

    // Guardar permisos y recargar datos
    const handleSavePermissions = async () => {
        const selectedRole = roles.find(role => role.id === selectedRoleId);
        if (!selectedRole) {
            notification.error({ message: 'Rol seleccionado no válido' });
            return;
        }

        setIsLoading(true);

        try {
            let response;

            if (useMockData) {
                console.log("Guardando permisos con mock");
                response = await mockApiCall(
                    `/roles/${selectedRoleId}/asignar_permisos/`,
                    { roleId: selectedRoleId, permisos: rolePermissions }
                );
            } else {
                const updatedRolePermissions = {
                    permisos: rolePermissions,
                    nombre: selectedRole.nombre,
                    descripcion: selectedRole.descripcion
                };
                response = await api.post(`/roles/${selectedRoleId}/asignar_permisos/`, updatedRolePermissions);
            }

            notification.success({
                message: 'Permisos actualizados correctamente',
                description: `Se actualizaron ${rolePermissions.length} permisos para el rol ${selectedRole.nombre}`
            });

            // Recargar datos actualizados
            if (useMockData) {
                // Actualizar localmente para mocks
                const updatedRoles = roles.map(role =>
                    role.id === selectedRoleId
                        ? { ...role, permisos: rolePermissions }
                        : role
                );
                setRoles(updatedRoles);
            } else {
                const updatedRolesData = await api.get("/roles/");
                setRoles(updatedRolesData.data);
                const updatedRole = updatedRolesData.data.find(role => role.id === selectedRoleId);
                setRolePermissions(updatedRole?.permisos || []);
            }
        } catch (error) {
            notification.error({
                message: 'Error al actualizar permisos',
                description: error.response?.data?.detail || error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Probar diferentes escenarios
    const testScenario = (scenario) => {
        setUseMockData(true);
        setSelectedRoleId(null);
        setRolePermissions([]);

        switch (scenario) {
            case 'admin':
                setSelectedRoleId(1);
                setRolePermissions(MOCK_ROLES[0].permisos);
                break;
            case 'moderator':
                setSelectedRoleId(2);
                setRolePermissions(MOCK_ROLES[1].permisos);
                break;
            case 'user':
                setSelectedRoleId(3);
                setRolePermissions(MOCK_ROLES[2].permisos);
                break;
            case 'empty':
                setSelectedRoleId(4);
                setRolePermissions([]);
                break;
            default:
                break;
        }
    };

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
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
                                    onClick={() => testScenario('admin')}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                >
                                    Rol Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('moderator')}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                    Rol Moderador
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('user')}
                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                >
                                    Rol Usuario
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('empty')}
                                    className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                >
                                    Rol Vacío
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {useMockData && process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                    <strong>Modo Prueba:</strong> Gestionando permisos con datos mock
                    {selectedRoleId && ` - Rol seleccionado: ${roles.find(r => r.id === selectedRoleId)?.nombre}`}
                </div>
            )}

            <Title level={3} className="text-center">Gestionar Permisos</Title>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Seleccionar Rol:</h3>
                <Select
                    style={{ width: '100%' }}
                    onChange={handleRoleChange}
                    value={selectedRoleId}
                    placeholder="Seleccionar Rol"
                    loading={isLoading}
                >
                    {roles.length > 0 ? (
                        roles.map(role => (
                            <Select.Option key={role.id} value={role.id}>
                                <div>
                                    <div className="font-medium">{role.nombre}</div>
                                    <div className="text-xs text-gray-500">{role.descripcion}</div>
                                </div>
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option disabled>No hay roles disponibles</Select.Option>
                    )}
                </Select>
            </div>

            {selectedRoleId && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            Permisos actuales: {rolePermissions.length} de {permissions.length}
                        </span>
                        <span className="text-sm text-gray-600">
                            Rol: {roles.find(r => r.id === selectedRoleId)?.nombre}
                        </span>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Permisos Disponibles:</h3>
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {Object.entries(groupedPermissions).length > 0 ? (
                        Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                            <div key={category} className="mb-6 last:mb-0">
                                <h4 className="font-semibold text-md mb-3 pb-2 border-b border-gray-200 text-gray-700">
                                    {category} ({categoryPermissions.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {categoryPermissions.map(permission => (
                                        <div key={permission.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded">
                                            <Checkbox
                                                disabled={!selectedRoleId || isLoading}
                                                checked={rolePermissions.includes(permission.id)}
                                                onChange={() => handlePermissionChange(permission.id)}
                                            >
                                                <div>
                                                    <div className="font-medium">{permission.nombre}</div>
                                                    <div className="text-xs text-gray-500">{permission.descripcion}</div>
                                                </div>
                                            </Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay permisos disponibles
                        </div>
                    )}
                </div>
            </div>

            <div>
                <Button
                    className="w-full"
                    type="primary"
                    size="large"
                    disabled={!selectedRoleId || isLoading}
                    onClick={handleSavePermissions}
                    loading={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Permisos'}
                </Button>
            </div>

            {/* Información de mocks en desarrollo */}
            {process.env.NODE_ENV === 'development' && useMockData && (
                <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                    <p className="font-semibold mb-2">Datos mock disponibles:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Roles ({roles.length}):</strong>
                            <ul className="mt-1 space-y-1">
                                {roles.map(role => (
                                    <li key={role.id}>
                                        {role.nombre} ({role.permisos?.length || 0} permisos)
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Permisos ({permissions.length}):</strong>
                            <ul className="mt-1 space-y-1">
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <li key={category}>
                                        {category}: {perms.length}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePermissions;
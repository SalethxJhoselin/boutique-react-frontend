import { Button, Select, Space, Table, Tag, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Title } = Typography;

// Mocks de datos para desarrollo
const MOCK_USERS = [
    {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan.perez@ejemplo.com",
        roles: [2, 3],
        fecha_registro: "2024-01-15",
        activo: true,
        ultimo_acceso: "2024-03-20"
    },
    {
        id: 2,
        nombre: "María García",
        email: "maria.garcia@ejemplo.com",
        roles: [2],
        fecha_registro: "2024-02-10",
        activo: true,
        ultimo_acceso: "2024-03-19"
    },
    {
        id: 3,
        nombre: "Carlos López",
        email: "carlos.lopez@ejemplo.com",
        roles: [1, 2],
        fecha_registro: "2024-01-05",
        activo: true,
        ultimo_acceso: "2024-03-21"
    },
    {
        id: 4,
        nombre: "Ana Martínez",
        email: "ana.martinez@ejemplo.com",
        roles: [3],
        fecha_registro: "2024-03-01",
        activo: false,
        ultimo_acceso: "2024-03-10"
    },
    {
        id: 5,
        nombre: "Pedro Sánchez",
        email: "pedro.sanchez@ejemplo.com",
        roles: [2, 4],
        fecha_registro: "2024-02-20",
        activo: true,
        ultimo_acceso: "2024-03-18"
    }
];

const MOCK_ROLES = [
    {
        id: 1,
        nombre: "Administrador",
        descripcion: "Acceso completo al sistema",
        color: "#f50"
    },
    {
        id: 2,
        nombre: "Moderador",
        descripcion: "Puede gestionar contenido",
        color: "#2db7f5"
    },
    {
        id: 3,
        nombre: "Usuario Premium",
        descripcion: "Usuario con privilegios especiales",
        color: "#87d068"
    },
    {
        id: 4,
        nombre: "Usuario Básico",
        descripcion: "Usuario estándar",
        color: "#108ee9"
    },
    {
        id: 5,
        nombre: "Invitado",
        descripcion: "Acceso limitado",
        color: "#ccc"
    }
];

const MOCK_ERROR_RESPONSES = {
    update_error: {
        detail: "Error al actualizar roles",
        message: "No se pudieron asignar los roles al usuario"
    },
    load_error: {
        detail: "Error al cargar datos",
        message: "No se pudieron cargar los usuarios o roles"
    }
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRoleIds, setSelectedRoleIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);

    // Simular llamadas a API con mocks
    const mockApiCall = async (method, endpoint, data = null, shouldError = false) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        if (shouldError) {
            throw {
                response: {
                    data: MOCK_ERROR_RESPONSES.update_error
                }
            };
        }

        switch (method) {
            case 'GET':
                if (endpoint === "/usuarios/") {
                    return { data: MOCK_USERS };
                } else if (endpoint === "/roles/") {
                    return { data: MOCK_ROLES };
                }
                break;
            case 'POST':
                // Simular actualización de roles
                if (endpoint.includes('/actualizar_roles/')) {
                    const userId = endpoint.split('/')[2];
                    return {
                        data: {
                            success: true,
                            user_id: parseInt(userId),
                            roles: data.rol_ids
                        }
                    };
                }
                break;
            default:
                return { data: [] };
        }
    };

    // Obtener usuarios registrados y roles disponibles
    const fetchUsersAndRoles = async () => {
        setIsLoading(true);
        try {
            let usersData, rolesData;

            if (useMockData) {
                console.log("Usando mocks de usuarios y roles");
                usersData = await mockApiCall('GET', '/usuarios/');
                rolesData = await mockApiCall('GET', '/roles/');
            } else {
                [usersData, rolesData] = await Promise.all([
                    api.get("/usuarios/"),
                    api.get("/roles/")
                ]);
            }

            setUsers(usersData.data);
            setRoles(rolesData.data);

            notification.success({
                message: 'Datos cargados correctamente',
                description: `${usersData.data.length} usuarios y ${rolesData.data.length} roles cargados`
            });
        } catch (error) {
            console.error('Error loading data:', error);
            notification.error({
                message: 'Error al obtener datos',
                description: error.response?.data?.detail || error.message,
            });

            // En caso de error, cargar mocks automáticamente
            if (!useMockData) {
                setUseMockData(true);
                const loadMockData = async () => {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setUsers(MOCK_USERS);
                    setRoles(MOCK_ROLES);
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

    useEffect(() => {
        fetchUsersAndRoles();
    }, [useMockData]);

    // Guardar los nuevos roles del usuario
    const handleSaveRole = async (userId) => {
        if (!selectedRoleIds.length) {
            notification.warning({ message: 'Debe seleccionar al menos un rol antes de guardar.' });
            return;
        }

        setIsLoading(true);
        try {
            let response;
            const payload = { rol_ids: selectedRoleIds };

            if (useMockData) {
                console.log("Actualizando roles con mock");
                response = await mockApiCall('POST', `/usuarios/${userId}/actualizar_roles/`, payload);
            } else {
                response = await api.post(`/usuarios/${userId}/actualizar_roles/`, payload);
            }

            notification.success({
                message: 'Roles asignados correctamente.',
                description: `Se asignaron ${selectedRoleIds.length} roles al usuario`
            });

            // Actualizar la lista de usuarios con los nuevos roles asignados
            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, roles: selectedRoleIds } : user
            );
            setUsers(updatedUsers);

            // Salir del modo de edición
            setEditingUserId(null);
            setSelectedRoleIds([]);
        } catch (error) {
            notification.error({
                message: 'Error al asignar los roles',
                description: error.response?.data?.detail || error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Probar diferentes escenarios
    const testScenario = (scenario) => {
        setUseMockData(true);
        setEditingUserId(null);
        setSelectedRoleIds([]);

        switch (scenario) {
            case 'basic':
                setUsers(MOCK_USERS);
                break;
            case 'empty':
                setUsers([]);
                break;
            case 'single_role':
                setUsers(MOCK_USERS.map(user => ({ ...user, roles: [2] })));
                break;
            case 'error':
                notification.error({
                    message: 'Error simulado',
                    description: 'No se pudieron cargar los usuarios'
                });
                break;
            default:
                setUsers(MOCK_USERS);
        }
    };

    // Renderizar tags de roles con colores
    const renderRoleTags = (roleIds) => (
        <Space wrap>
            {roleIds.map(roleId => {
                const role = roles.find(role => role.id === roleId);
                return (
                    <Tag
                        key={roleId}
                        color={role?.color || '#108ee9'}
                        style={{ margin: '2px' }}
                    >
                        {role?.nombre || `Rol ${roleId}`}
                    </Tag>
                );
            })}
        </Space>
    );

    // Columnas de la tabla
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            width: 100,
            render: (activo) => (
                <Tag color={activo ? 'green' : 'red'}>
                    {activo ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
            filters: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            onFilter: (value, record) => record.activo === value,
        },
        {
            title: 'Roles',
            key: 'roles',
            width: 300,
            render: (_, record) => {
                if (record.id === editingUserId) {
                    return (
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Seleccionar Roles"
                            onChange={(values) => setSelectedRoleIds(values)}
                            value={selectedRoleIds}
                            loading={isLoading}
                            optionLabelProp="label"
                        >
                            {roles.map(role => (
                                <Select.Option
                                    key={role.id}
                                    value={role.id}
                                    label={role.nombre}
                                >
                                    <Tag color={role.color}>{role.nombre}</Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }

                return renderRoleTags(record.roles || []);
            },
        },
        {
            title: 'Acciones',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    {record.id === editingUserId ? (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleSaveRole(record.id)}
                                loading={isLoading}
                            >
                                Guardar
                            </Button>
                            <Button
                                onClick={() => {
                                    setEditingUserId(null);
                                    setSelectedRoleIds([]);
                                }}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => {
                                setEditingUserId(record.id);
                                setSelectedRoleIds(record.roles || []);
                            }}
                            disabled={isLoading}
                        >
                            Editar Roles
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

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
                                    onClick={() => testScenario('basic')}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                    Usuarios Básicos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('empty')}
                                    className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                >
                                    Sin Usuarios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('single_role')}
                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                >
                                    Rol Único
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('error')}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                >
                                    Simular Error
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {useMockData && process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                    <strong>Modo Prueba:</strong> Gestionando usuarios con datos mock - {users.length} usuarios cargados
                </div>
            )}

            <Title level={3} className="text-center">Usuarios Registrados</Title>

            <div className="mb-4 text-sm text-gray-600">
                Total: {users.length} usuarios
                {useMockData && " (datos de prueba)"}
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} de ${total} usuarios`
                }}
                loading={isLoading}
                bordered
                scroll={{ x: 1000 }}
            />

            {/* Información de mocks en desarrollo */}
            {process.env.NODE_ENV === 'development' && useMockData && (
                <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                    <p className="font-semibold mb-2">Datos mock disponibles:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Usuarios ({users.length}):</strong>
                            <ul className="mt-1 space-y-1">
                                {MOCK_USERS.map(user => (
                                    <li key={user.id}>
                                        {user.nombre} - {user.roles.length} roles
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Roles ({roles.length}):</strong>
                            <ul className="mt-1 space-y-1">
                                {MOCK_ROLES.map(role => (
                                    <li key={role.id}>
                                        <Tag color={role.color} style={{ marginRight: 4 }}>
                                            {role.nombre}
                                        </Tag>
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

export default ManageUsers;
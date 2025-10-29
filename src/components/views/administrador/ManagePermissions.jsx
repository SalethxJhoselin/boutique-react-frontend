import { Button, Checkbox, Select, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;

// Datos de prueba para simular roles
const mockRoles = [
    {
        id: 1,
        nombre: "Administrador",
        descripcion: "Acceso completo al sistema",
        permisos: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 2,
        nombre: "Usuario",
        descripcion: "Usuario estándar",
        permisos: [1, 3, 5]
    },
    {
        id: 3,
        nombre: "Moderador",
        descripcion: "Moderador de contenido",
        permisos: [1, 2, 3, 4]
    }
];

// Datos de prueba para simular permisos
const mockPermissions = [
    {
        id: 1,
        nombre: "Ver productos",
        descripcion: "Permiso para ver productos del catálogo"
    },
    {
        id: 2,
        nombre: "Editar productos",
        descripcion: "Permiso para editar productos existentes"
    },
    {
        id: 3,
        nombre: "Crear productos",
        descripcion: "Permiso para crear nuevos productos"
    },
    {
        id: 4,
        nombre: "Eliminar productos",
        descripcion: "Permiso para eliminar productos"
    },
    {
        id: 5,
        nombre: "Gestionar usuarios",
        descripcion: "Permiso para gestionar usuarios del sistema"
    },
    {
        id: 6,
        nombre: "Configurar sistema",
        descripcion: "Permiso para configurar parámetros del sistema"
    }
];

const ManagePermissions = () => {
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    // Cargar roles y permisos al montar el componente
    useEffect(() => {
        const loadRolesAndPermissions = async () => {
            try {
                // SIMULACIÓN: Reemplazar estas líneas con las peticiones reales cuando estén disponibles
                // const [rolesData, permissionsData] = await Promise.all([
                //     api.get("/roles/"),
                //     api.get("/permisos/")
                // ]);

                // Simulación temporal
                const rolesData = { data: mockRoles };
                const permissionsData = { data: mockPermissions };

                setRoles(rolesData.data);
                setPermissions(permissionsData.data);
            } catch (error) {
                notification.error({
                    message: 'Error al obtener roles o permisos',
                    description: error.response?.data?.detail || error.message
                });
            }
        };

        loadRolesAndPermissions();
    }, []);

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

    // Guardar permisos y recargar datos
    const handleSavePermissions = async () => {
        const selectedRole = roles.find(role => role.id === selectedRoleId);
        if (!selectedRole) {
            notification.error({ message: 'Rol seleccionado no válido' });
            return;
        }

        const updatedRolePermissions = {
            permisos: rolePermissions,
            nombre: selectedRole.nombre,
            descripcion: selectedRole.descripcion
        };

        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // await api.post(`/roles/${selectedRoleId}/asignar_permisos/`, updatedRolePermissions);

            // Simulación temporal - actualizar datos localmente
            const updatedRoles = roles.map(role =>
                role.id === selectedRoleId
                    ? { ...role, permisos: rolePermissions }
                    : role
            );

            setRoles(updatedRoles);

            notification.success({ message: 'Permisos actualizados correctamente' });

            // Recargar datos actualizados (simulación)
            const updatedRole = updatedRoles.find(role => role.id === selectedRoleId);
            setRolePermissions(updatedRole?.permisos || []);
        } catch (error) {
            notification.error({
                message: 'Error al actualizar permisos',
                description: error.response?.data?.detail || error.message
            });
        }
    };

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
            <Title level={3} className="text-center">Gestionar Permisos</Title>
            <div className="mb-6">
                <h3 className="text-lg">Rol:</h3>
                <Select
                    style={{ width: '100%' }}
                    onChange={handleRoleChange}
                    value={selectedRoleId}
                    placeholder="Seleccionar Rol"
                >
                    {roles.length > 0 ? (
                        roles.map(role => (
                            <Select.Option key={role.id} value={role.id}>
                                {role.nombre}
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option>No data found</Select.Option>
                    )}
                </Select>
            </div>
            <div className="mb-6">
                <h3 className="text-lg">Permisos:</h3>
                <div className="flex flex-col items-start">
                    {permissions.length > 0 ? (
                        permissions.map(permission => (
                            <div key={permission.id} className="mb-2">
                                <Checkbox
                                    disabled={!selectedRoleId}
                                    checked={rolePermissions.includes(permission.id)}
                                    onChange={() => handlePermissionChange(permission.id)}
                                >
                                    {permission.nombre}
                                </Checkbox>
                            </div>
                        ))
                    ) : (
                        <span>No data found</span>
                    )}
                </div>
            </div>
            <div>
                <Button
                    className="w-full"
                    disabled={!selectedRoleId}
                    onClick={handleSavePermissions}
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default ManagePermissions;
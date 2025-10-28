import { Button, Select, Space, Table, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Title } = Typography;

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null); // Estado para el usuario en edición
    const [selectedRoleIds, setSelectedRoleIds] = useState([]); // Estado para los roles seleccionados

    // Obtener usuarios registrados y roles disponibles
    const fetchUsersAndRoles = async () => {
        try {
            const [usersData, rolesData] = await Promise.all([
                api.get("/usuarios/"),
                api.get("/roles/")
            ]);
            setUsers(usersData.data);
            setRoles(rolesData.data);
        } catch (error) {
            notification.error({
                message: 'Error al obtener datos',
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    useEffect(() => {
        fetchUsersAndRoles();
    }, []);

    // Guardar los nuevos roles del usuario
    const handleSaveRole = async (userId) => {
        if (!selectedRoleIds.length) {
            notification.warning({ message: 'Debe seleccionar al menos un rol antes de guardar.' });
            return;
        }

        try {
            const payload = { rol_ids: selectedRoleIds }; // Payload con múltiples roles
            await api.post(`/usuarios/${userId}/actualizar_roles/`, payload);
            notification.success({ message: 'Roles asignados correctamente.' });

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
        }
    };

    // Columnas de la tabla
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Roles',
            key: 'roles',
            render: (_, record) => {
                if (record.id === editingUserId) {
                    return (
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Seleccionar Roles"
                            onChange={(values) => setSelectedRoleIds(values)}
                            value={selectedRoleIds}
                        >
                            {roles.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.nombre}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }

                return (
                    <Space>
                        {record.roles.map(roleId => {
                            const role = roles.find(role => role.id === roleId);
                            return (
                                <span key={roleId} className="badge">
                                    {role?.nombre || `Rol ${roleId}`}
                                </span>
                            );
                        })}
                    </Space>
                );
            },
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.id === editingUserId ? (
                        <>
                            <Button type="primary" onClick={() => handleSaveRole(record.id)}>
                                Guardar
                            </Button>
                            <Button onClick={() => {
                                setEditingUserId(null);
                                setSelectedRoleIds([]);
                            }}>
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={() => {
                            setEditingUserId(record.id);
                            setSelectedRoleIds(record.roles || []); // Seleccionar los roles actuales del usuario
                        }}>
                            Editar Roles
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
            <Title level={3} className="text-center">Usuarios Registrados</Title>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 5, size: 'small' }}
                bordered
            />
        </div>
    );
};

export default ManageUsers;

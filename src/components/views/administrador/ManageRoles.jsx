import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import RoleModal from './RoleModal';

const { Title } = Typography;

// Datos de prueba para simular roles
const mockRoles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema"
  },
  {
    id: 2,
    nombre: "Usuario",
    descripcion: "Usuario estándar"
  },
  {
    id: 3,
    nombre: "Moderador",
    descripcion: "Moderador de contenido"
  },
  {
    id: 4,
    nombre: "Invitado",
    descripcion: "Acceso limitado"
  }
];

const ManageRoles = () => {
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [roles, setRoles] = useState([]);

  // Obtener datos
  const fetchData = async () => {
    try {
      // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
      // const rolesData = await api.get("/roles/");
      const rolesData = { data: mockRoles }; // Simulación temporal
      setRoles(rolesData.data);
    } catch (error) {
      notification.error({ message: 'Error al obtener roles', description: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(roles)

  const handleEditRole = useCallback((roleId) => {
    setEditingRoleId(roleId);
    const role = roles.find(role => role.id === roleId);
    setEditedData({ [roleId]: { nombre: role.nombre } });
  }, [roles]);

  const handleSaveRole = useCallback(async (roleId) => {
    try {
      console.log("el usuario edito el rol")
      // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
      // await api.put(`/roles/${roleId}/`, {
      //   nombre: editedData[roleId]
      // });

      // Simulación temporal - actualizar localmente
      setRoles(prevRoles => prevRoles.map(role =>
        role.id === roleId ? { ...role, ...editedData[roleId] } : role
      ));
      setEditingRoleId(null);
      notification.success({ message: 'Rol actualizado correctamente' });
    } catch (error) {
      notification.error({ message: 'Error al guardar el rol', description: error.message });
    }
  }, [editedData]);

  const handleCancelEdit = useCallback(() => {
    setEditingRoleId(null);
    setEditedData({});
  }, []);

  const handleDeleteRole = useCallback(async (roleName) => {
    try {
      console.log('roleNameEEE', roleName)
      // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
      // await api.delete(`/roles/${roleName}/`)

      // Simulación temporal - eliminar localmente
      console.log("el usuario elimino el rol")
      setRoles(prevRoles => prevRoles.filter(role => role.nombre !== roleName));
      notification.success({ message: 'Rol eliminado correctamente' });

    } catch (error) {
      notification.error({ message: 'Error al eliminar el rol', description: error.message });
    }
  }, []);

  const handleInputChange = useCallback((value, roleId, field) => {
    setEditedData(prevState => ({
      ...prevState,
      [roleId]: {
        ...prevState[roleId],
        [field]: value
      }
    }));
  }, []);

  const renderEditableInput = useCallback((text, record, dataIndex) => {
    if (record.id === editingRoleId && dataIndex === 'nombre') {
      return (
        <Input
          value={editedData[record.id]?.[dataIndex] || text}
          onChange={(e) => handleInputChange(e.target.value, record.id, dataIndex)}
          onPressEnter={() => handleSaveRole(record.id)}
        />
      );
    }
    return text;
  }, [editingRoleId, editedData, handleInputChange, handleSaveRole]);

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
      render: (text, record) => renderEditableInput(text, record, 'nombre'),
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {editingRoleId === record.id ? (
            <>
              <Button type="primary" onClick={() => handleSaveRole(record.id)}>Guardar</Button>
              <Button onClick={handleCancelEdit}>Cancelar</Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => handleEditRole(record.id)}><EditOutlined /></Button>
              <Button style={{
                backgroundColor: '#F44336',
                color: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
                onClick={() => handleDeleteRole(record.nombre)}><DeleteOutlined /></Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
      <Title level={3} className="text-center">Gestionar Roles</Title>
      <div className="flex justify-end mb-6">
        <RoleModal getDatos={fetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={{ pageSize: 5, size: 'small' }}
        bordered
      />
    </div>
  );
};

export default ManageRoles;
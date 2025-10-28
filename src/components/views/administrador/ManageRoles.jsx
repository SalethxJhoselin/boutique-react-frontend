import React, { useEffect, useState, useCallback } from 'react';
import { Space, Table, Button, Input, Typography, notification } from 'antd';
import RoleModal from './RoleModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../api/apiServices';

const { Title } = Typography;

// Mocks de datos para desarrollo
const MOCK_ROLES = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: [1, 2, 3, 4, 5, 6],
    fecha_creacion: "2024-01-01",
    usuarios_count: 3
  },
  {
    id: 2,
    nombre: "Moderador",
    descripcion: "Puede gestionar contenido y usuarios",
    permisos: [2, 3, 4, 6],
    fecha_creacion: "2024-01-15",
    usuarios_count: 5
  },
  {
    id: 3,
    nombre: "Usuario",
    descripcion: "Usuario estándar del sistema",
    permisos: [4, 6],
    fecha_creacion: "2024-02-01",
    usuarios_count: 150
  },
  {
    id: 4,
    nombre: "Invitado",
    descripcion: "Acceso limitado de solo lectura",
    permisos: [6],
    fecha_creacion: "2024-02-10",
    usuarios_count: 25
  }
];

const MOCK_ERROR_RESPONSES = {
  delete_error: {
    error: "No se puede eliminar el rol",
    message: "El rol tiene usuarios asignados"
  },
  update_error: {
    error: "Error al actualizar el rol",
    message: "El nombre del rol ya existe"
  },
  load_error: {
    error: "Error al cargar roles",
    message: "No se pudieron cargar los roles del sistema"
  }
};

const ManageRoles = () => {
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Simular llamadas a API con mocks
  const mockApiCall = async (method, endpoint, data = null, shouldError = false) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (shouldError) {
      throw {
        response: {
          data: MOCK_ERROR_RESPONSES.update_error
        }
      };
    }

    switch (method) {
      case 'GET':
        return { data: [...MOCK_ROLES] };
      case 'PUT':
        // Simular actualización de rol
        const updatedRole = {
          ...MOCK_ROLES.find(role => role.id === data.id),
          ...data
        };
        return { data: updatedRole };
      case 'DELETE':
        // Simular eliminación (solo permite eliminar roles sin usuarios)
        const roleToDelete = MOCK_ROLES.find(role => role.nombre === data.roleName);
        if (roleToDelete && roleToDelete.usuarios_count > 0) {
          throw {
            response: {
              data: MOCK_ERROR_RESPONSES.delete_error
            }
          };
        }
        return { data: { success: true } };
      default:
        return { data: [] };
    }
  };

  // Obtener datos
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let rolesData;

      if (useMockData) {
        console.log("Usando mocks de roles");
        rolesData = await mockApiCall('GET', '/roles/');
      } else {
        rolesData = await api.get("/roles/");
      }

      setRoles(rolesData.data);
      notification.success({
        message: 'Datos cargados',
        description: `Se cargaron ${rolesData.data.length} roles`
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      notification.error({
        message: 'Error al obtener roles',
        description: error.response?.data?.message || error.message
      });

      // En caso de error, cargar mocks automáticamente
      if (!useMockData) {
        setUseMockData(true);
        const loadMockData = async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          setRoles(MOCK_ROLES);
          notification.info({
            message: 'Usando datos de prueba',
            description: 'Se cargaron roles mock para desarrollo'
          });
        };
        loadMockData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [useMockData]);

  const handleEditRole = useCallback((roleId) => {
    setEditingRoleId(roleId);
    const role = roles.find(role => role.id === roleId);
    setEditedData({
      [roleId]: {
        nombre: role.nombre,
        descripcion: role.descripcion
      }
    });
  }, [roles]);

  const handleSaveRole = useCallback(async (roleId) => {
    setIsLoading(true);
    try {
      let response;

      if (useMockData) {
        console.log("Editando rol con mock");
        response = await mockApiCall('PUT', `/roles/${roleId}/`, {
          id: roleId,
          nombre: editedData[roleId]?.nombre,
          descripcion: editedData[roleId]?.descripcion
        });
      } else {
        response = await api.put(`/roles/${roleId}/`, editedData[roleId]);
      }

      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === roleId ? { ...role, ...response.data } : role
        )
      );

      setEditingRoleId(null);
      setEditedData({});

      notification.success({
        message: 'Rol actualizado',
        description: `El rol "${response.data.nombre}" se actualizó correctamente`
      });
    } catch (error) {
      notification.error({
        message: 'Error al guardar el rol',
        description: error.response?.data?.message || error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [editedData, useMockData]);

  const handleCancelEdit = useCallback(() => {
    setEditingRoleId(null);
    setEditedData({});
  }, []);

  const handleDeleteRole = useCallback(async (roleName) => {
    setIsLoading(true);
    try {
      let response;

      if (useMockData) {
        console.log("Eliminando rol con mock");
        response = await mockApiCall('DELETE', `/roles/`, { roleName });
      } else {
        response = await api.delete(`/roles/${roleName}/`);
      }

      setRoles(prevRoles => prevRoles.filter(role => role.nombre !== roleName));

      notification.success({
        message: 'Rol eliminado',
        description: `El rol "${roleName}" se eliminó correctamente`
      });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar el rol',
        description: error.response?.data?.message || error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

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
    if (record.id === editingRoleId && (dataIndex === 'nombre' || dataIndex === 'descripcion')) {
      return (
        <Input
          value={editedData[record.id]?.[dataIndex] || text}
          onChange={(e) => handleInputChange(e.target.value, record.id, dataIndex)}
          onPressEnter={() => handleSaveRole(record.id)}
          placeholder={`Ingrese ${dataIndex}`}
        />
      );
    }
    return text;
  }, [editingRoleId, editedData, handleInputChange, handleSaveRole]);

  // Probar diferentes escenarios
  const testScenario = (scenario) => {
    setUseMockData(true);
    setEditingRoleId(null);
    setEditedData({});

    switch (scenario) {
      case 'basic':
        setRoles(MOCK_ROLES);
        break;
      case 'empty':
        setRoles([]);
        break;
      case 'error':
        // Simular error de carga
        notification.error({
          message: 'Error de carga simulado',
          description: 'No se pudieron cargar los roles'
        });
        break;
      default:
        setRoles(MOCK_ROLES);
    }
  };

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
      render: (text, record) => renderEditableInput(text, record, 'nombre'),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => renderEditableInput(text, record, 'descripcion'),
    },
    {
      title: 'Usuarios',
      dataIndex: 'usuarios_count',
      key: 'usuarios_count',
      width: 100,
      render: (count) => count || 0,
      sorter: (a, b) => (a.usuarios_count || 0) - (b.usuarios_count || 0),
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      key: 'permisos',
      render: (permisos) => permisos ? `${permisos.length} permisos` : '0 permisos',
    },
    {
      title: 'Acciones',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {editingRoleId === record.id ? (
            <>
              <Button
                type="primary"
                onClick={() => handleSaveRole(record.id)}
                loading={isLoading}
              >
                Guardar
              </Button>
              <Button
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => handleEditRole(record.id)}
                icon={<EditOutlined />}
                disabled={isLoading}
              >
                Editar
              </Button>
              <Button
                danger
                onClick={() => handleDeleteRole(record.nombre)}
                icon={<DeleteOutlined />}
                loading={isLoading}
                disabled={record.usuarios_count > 0}
              >
                Eliminar
              </Button>
            </>
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
                  Roles Básicos
                </button>
                <button
                  type="button"
                  onClick={() => testScenario('empty')}
                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                >
                  Sin Roles
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
          <strong>Modo Prueba:</strong> Gestionando roles con datos mock - {roles.length} roles cargados
        </div>
      )}

      <Title level={3} className="text-center">Gestionar Roles</Title>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Total: {roles.length} roles
          {useMockData && " (datos de prueba)"}
        </div>
        <RoleModal getDatos={fetchData} useMockData={useMockData} />
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={{
          pageSize: 5,
          size: 'small',
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} roles`
        }}
        loading={isLoading}
        bordered
        scroll={{ x: 800 }}
      />

      {/* Información de mocks en desarrollo */}
      {process.env.NODE_ENV === 'development' && useMockData && (
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <p className="font-semibold mb-2">Roles mock disponibles:</p>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_ROLES.map(role => (
              <div key={role.id} className="border-l-4 border-blue-500 pl-2">
                <strong>ID {role.id}:</strong> {role.nombre}
                <br />
                <span className="text-gray-500">
                  {role.usuarios_count} usuarios, {role.permisos?.length || 0} permisos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;
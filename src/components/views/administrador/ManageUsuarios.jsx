import React, { useEffect, useState, useCallback } from 'react';
import { Space, Table, Input, Typography } from 'antd';

// Datos simulados para usuarios
const simulatedUsers = [
  { id: 1, name: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'López', correo: 'juan.perez@example.com', ci: '12345678' },
  { id: 2, name: 'María', apellidoPaterno: 'Gómez', apellidoMaterno: 'Martínez', correo: 'maria.gomez@example.com', ci: '87654321' }
];

const { Title } = Typography;
const ManageUsuarios = () => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [users, setUsers] = useState([]);

  // Obtener datos
  useEffect(() => {
    setUsers(simulatedUsers);
  }, []);

  const handleInputChange = useCallback((value, userId, field) => {
    setEditedData(prevState => ({
      ...prevState,
      [userId]: {
        ...prevState[userId],
        [field]: value
      }
    }));
  }, []);

  const renderEditableInput = useCallback((text, record, dataIndex) => {
    if (record.id === editingUserId) {
      return (
        <Input
          value={editedData[record.id]?.[dataIndex] || text}
          onChange={(e) => handleInputChange(e.target.value, record.id, dataIndex)}
        />
      );
    }
    return text;
  }, [editingUserId, editedData, handleInputChange]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => renderEditableInput(text, record, 'name'),
    },
    {
      title: 'Apellido Paterno',
      dataIndex: 'apellidoPaterno',
      key: 'apellidoPaterno',
      render: (text, record) => renderEditableInput(text, record, 'apellidoPaterno'),
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'apellidoMaterno',
      key: 'apellidoMaterno',
      render: (text, record) => renderEditableInput(text, record, 'apellidoMaterno'),
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
      render: (text, record) => renderEditableInput(text, record, 'correo'),
    },
    {
      title: 'CI',
      dataIndex: 'ci',
      key: 'ci',
      render: (text, record) => renderEditableInput(text, record, 'ci'),
    },
  ];

  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg mt-2 ml-2 mr-2">
      <Title level={3} className="text-center">Gestionar Usuarios</Title>
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

export default ManageUsuarios;
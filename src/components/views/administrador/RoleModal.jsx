import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal } from 'antd';
import { useState } from 'react';

const RoleModal = ({ getDatos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // await api.post("/roles/", { nombre: roleName });

            // Simulación temporal - crear rol localmente
            console.log(`el usuario x creo el rol: ${roleName}`);
            setIsModalOpen(false);
            setRoleName('');
            getDatos();
            messageApi.success('Rol guardado exitosamente');
        } catch (error) {
            console.error('Error al crear el rooool:', error);
            messageApi.error('Error al guardar el rol');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRoleName('');
    };

    return (
        <>
            <Button
                style={{
                    backgroundColor: '#4CAF50', // Color de fondo
                    color: '#fff', // Color del texto
                    borderRadius: '15px', // Bordes redondeados
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Sombra
                }}
                onClick={() => setIsModalOpen(true)}
            >
                <PlusOutlined />
                <span>Crear Rol</span>
            </Button>
            <Modal
                title="Agregar Rol"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Guardar"
                cancelText="Cerrar"
                okButtonProps={{ disabled: !roleName }}
            >
                <Input
                    placeholder="Nombre del rol..."
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                {contextHolder}
            </Modal>
        </>
    );
};

export default RoleModal;
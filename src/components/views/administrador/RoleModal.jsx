import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Modal } from 'antd';
import { useState } from 'react';
import api from '../../../api/apiServices';

// Mocks de datos para desarrollo
const MOCK_RESPONSES = {
    success: {
        id: Math.floor(Math.random() * 1000) + 100,
        nombre: "",
        descripcion: null,
        permisos: [],
        fecha_creacion: new Date().toISOString().split('T')[0],
        usuarios_count: 0
    },
    error: {
        detail: "Error al crear el rol",
        message: "El nombre del rol ya existe o es inválido"
    }
};

const MOCK_EXISTING_ROLES = [
    "Administrador",
    "Moderador",
    "Usuario",
    "Invitado",
    "Supervisor"
];

const RoleModal = ({ getDatos, useMockData = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    // Simular creación de rol con mock
    const mockCreateRole = async (roleName, shouldError = false) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (shouldError) {
            throw {
                response: {
                    data: MOCK_RESPONSES.error
                }
            };
        }

        // Validar nombre único
        if (MOCK_EXISTING_ROLES.includes(roleName)) {
            throw {
                response: {
                    data: {
                        detail: "El nombre del rol ya existe",
                        message: "Ya existe un rol con ese nombre"
                    }
                }
            };
        }

        // Validar longitud mínima
        if (roleName.length < 3) {
            throw {
                response: {
                    data: {
                        detail: "Nombre muy corto",
                        message: "El nombre del rol debe tener al menos 3 caracteres"
                    }
                }
            };
        }

        return {
            data: {
                ...MOCK_RESPONSES.success,
                nombre: roleName
            }
        };
    };

    const handleOk = async () => {
        if (!roleName.trim()) {
            messageApi.warning('Por favor ingrese un nombre para el rol');
            return;
        }

        setIsLoading(true);
        try {
            let response;

            if (useMockData) {
                console.log("Creando rol con mock");
                response = await mockCreateRole(roleName);
            } else {
                response = await api.post("/roles/", { nombre: roleName });
            }

            console.log(`Rol creado: ${roleName}`, response.data);

            setIsModalOpen(false);
            setRoleName('');
            form.resetFields();

            messageApi.success({
                content: 'Rol guardado exitosamente',
                description: `El rol "${roleName}" se creó correctamente`
            });

            // Recargar datos si se proporciona la función
            if (getDatos) {
                getDatos();
            }

        } catch (error) {
            console.error('Error al crear el rol:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.detail ||
                'Error al guardar el rol';

            messageApi.error({
                content: 'Error al crear el rol',
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRoleName('');
        form.resetFields();
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // Probar diferentes escenarios de creación
    const testScenario = (scenario) => {
        showModal();
        switch (scenario) {
            case 'success':
                setRoleName(`Nuevo Rol ${Math.floor(Math.random() * 1000)}`);
                break;
            case 'duplicate':
                setRoleName('Administrador');
                break;
            case 'short':
                setRoleName('AB');
                break;
            case 'special_chars':
                setRoleName('Rol@Especial#123');
                break;
            default:
                setRoleName('');
        }
    };

    return (
        <>
            {contextHolder}

            {/* Panel de control para desarrollo */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Modo Desarrollo:</span>
                        {useMockData && (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                                MOCK ACTIVO
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-gray-600 mb-1">Pruebas rápidas:</p>
                        <div className="flex flex-wrap gap-1">
                            <button
                                type="button"
                                onClick={() => testScenario('success')}
                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                                Éxito
                            </button>
                            <button
                                type="button"
                                onClick={() => testScenario('duplicate')}
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                                Duplicado
                            </button>
                            <button
                                type="button"
                                onClick={() => testScenario('short')}
                                className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                            >
                                Nombre Corto
                            </button>
                            <button
                                type="button"
                                onClick={() => testScenario('special_chars')}
                                className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                            >
                                Caracteres Especiales
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Button
                style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    fontWeight: '500'
                }}
                onClick={showModal}
                icon={<PlusOutlined />}
                size="large"
            >
                Crear Rol
            </Button>

            <Modal
                title={
                    <div>
                        <span>Agregar Nuevo Rol</span>
                        {useMockData && process.env.NODE_ENV === 'development' && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                MOCK
                            </span>
                        )}
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Guardar"
                cancelText="Cancelar"
                okButtonProps={{
                    disabled: !roleName.trim(),
                    loading: isLoading,
                    style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                }}
                cancelButtonProps={{ disabled: isLoading }}
                confirmLoading={isLoading}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOk}
                >
                    <Form.Item
                        label="Nombre del Rol"
                        name="roleName"
                        rules={[
                            { required: true, message: 'Por favor ingrese el nombre del rol' },
                            { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                        ]}
                    >
                        <Input
                            placeholder="Ingrese el nombre del rol..."
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            onPressEnter={handleOk}
                            disabled={isLoading}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>

                    {/* Información de desarrollo */}
                    {useMockData && process.env.NODE_ENV === 'development' && (
                        <Alert
                            message="Modo Prueba Activado"
                            description={
                                <div>
                                    <p>Se están usando datos mock para desarrollo.</p>
                                    <p className="mt-1 text-xs">
                                        <strong>Roles existentes (conflicto):</strong> {MOCK_EXISTING_ROLES.join(', ')}
                                    </p>
                                </div>
                            }
                            type="info"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    {/* Validaciones visuales */}
                    {roleName.length > 0 && roleName.length < 3 && (
                        <Alert
                            message="Nombre muy corto"
                            description="El nombre del rol debe tener al menos 3 caracteres"
                            type="warning"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    {MOCK_EXISTING_ROLES.includes(roleName) && useMockData && (
                        <Alert
                            message="Rol duplicado"
                            description="Ya existe un rol con este nombre en el sistema"
                            type="error"
                            showIcon
                            className="mb-4"
                        />
                    )}
                </Form>

                {/* Información adicional en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                        <p><strong>Consejos de prueba:</strong></p>
                        <ul className="mt-1 list-disc list-inside">
                            <li>Nombres únicos: Se generan automáticamente</li>
                            <li>Nombres duplicados: Usar "Administrador", "Moderador", etc.</li>
                            <li>Validaciones: Mínimo 3 caracteres</li>
                        </ul>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default RoleModal;
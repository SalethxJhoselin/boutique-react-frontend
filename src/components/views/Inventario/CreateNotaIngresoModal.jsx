import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Select, Table, Tag, notification } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Option } = Select;

// Mocks de datos para desarrollo
const MOCK_PRODUCTOS = [
    {
        id: 1,
        nombre: "Zapatillas Running Pro",
        precio: 89.99,
        categoria: "Calzado Deportivo",
        stock: 15,
        codigo: "ZAP-RUN-001",
        marca: "SportMax"
    },
    {
        id: 2,
        nombre: "Camiseta Deportiva",
        precio: 29.99,
        categoria: "Ropa Deportiva",
        stock: 25,
        codigo: "CAM-DEP-002",
        marca: "ActiveWear"
    },
    {
        id: 3,
        nombre: "Short Deportivo",
        precio: 24.99,
        categoria: "Ropa Deportiva",
        stock: 30,
        codigo: "SHO-DEP-003",
        marca: "FitGear"
    },
    {
        id: 4,
        nombre: "Mochila Deportiva",
        precio: 45.50,
        categoria: "Accesorios",
        stock: 10,
        codigo: "MOC-DEP-004",
        marca: "OutdoorPro"
    },
    {
        id: 5,
        nombre: "Botella Deportiva",
        precio: 12.99,
        categoria: "Accesorios",
        stock: 50,
        codigo: "BOT-DEP-005",
        marca: "HydroFit"
    }
];

const MOCK_NOTA_INGRESO_RESPONSE = {
    id: Math.floor(Math.random() * 1000) + 1000,
    numero_ingreso: `NI-${Date.now()}`,
    fecha_emision: new Date().toISOString(),
    observacion: "",
    total_productos: 0,
    estado: "completado",
    detalles: []
};

const MOCK_ERROR_RESPONSES = {
    empty_details: {
        detail: "Detalles vacíos",
        message: "Debe agregar al menos un producto a la nota de ingreso"
    },
    server_error: {
        detail: "Error del servidor",
        message: "No se pudo crear la nota de ingreso en este momento"
    },
    invalid_quantity: {
        detail: "Cantidad inválida",
        message: "La cantidad debe ser mayor a 0"
    }
};

function CreateNotaIngresoModal({ visible, closeModal, refreshNotas }) {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);
    const [nota, setNota] = useState({
        observacion: '',
        detalles: [],
    });

    // Simular llamadas a API con mocks
    const mockApiCall = async (method, endpoint, data = null, shouldError = false) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        if (shouldError) {
            throw {
                response: {
                    data: MOCK_ERROR_RESPONSES.server_error
                }
            };
        }

        switch (method) {
            case 'GET':
                if (endpoint === '/productos/') {
                    return { data: MOCK_PRODUCTOS };
                }
                break;
            case 'POST':
                if (endpoint === '/notas-ingreso/') {
                    const totalProductos = data.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0);
                    return {
                        data: {
                            ...MOCK_NOTA_INGRESO_RESPONSE,
                            observacion: data.observacion,
                            total_productos: totalProductos,
                            detalles: data.detalles.map(detalle => ({
                                ...detalle,
                                id: Math.floor(Math.random() * 1000),
                                producto_nombre: MOCK_PRODUCTOS.find(p => p.id === detalle.producto)?.nombre
                            }))
                        }
                    };
                }
                break;
            default:
                return { data: [] };
        }
    };

    useEffect(() => {
        fetchProductos();
    }, [useMockData]);

    const fetchProductos = async () => {
        setIsLoading(true);
        try {
            let response;

            if (useMockData) {
                console.log("Cargando productos con mock");
                response = await mockApiCall('GET', '/productos/');
            } else {
                response = await api.get('/productos/');
            }

            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            notification.error({
                message: 'Error al cargar productos',
                description: error.response?.data?.message || error.message
            });

            // En caso de error, cargar mocks automáticamente
            if (!useMockData) {
                setUseMockData(true);
                setProductos(MOCK_PRODUCTOS);
                notification.info({
                    message: 'Usando datos de prueba',
                    description: 'Se cargaron productos mock para desarrollo'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar la selección de producto
    const handleAddProducto = (productoId) => {
        if (!productoId) return;

        // Verificar si el producto ya está seleccionado
        if (!nota.detalles.some((detalle) => detalle.producto === productoId)) {
            setNota((prevNota) => ({
                ...prevNota,
                detalles: [
                    ...prevNota.detalles,
                    { producto: productoId, cantidad: 1 },
                ],
            }));
        } else {
            notification.warning({
                message: 'Producto ya agregado',
                description: 'Este producto ya está en la lista de detalles'
            });
        }
    };

    // Función para manejar la actualización de la cantidad
    const handleCantidadChange = (productoId, cantidad) => {
        const cantidadNum = parseInt(cantidad);
        if (isNaN(cantidadNum) || cantidadNum < 1) {
            notification.warning({
                message: 'Cantidad inválida',
                description: 'La cantidad debe ser un número mayor a 0'
            });
            return;
        }

        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.map((detalle) =>
                detalle.producto === productoId
                    ? { ...detalle, cantidad: cantidadNum }
                    : detalle
            ),
        }));
    };

    // Función para manejar la eliminación de un producto
    const handleRemoveProducto = (productoId) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.filter((detalle) => detalle.producto !== productoId),
        }));
    };

    // Función para crear la nota de ingreso
    const handleCreateNota = async () => {
        if (nota.detalles.length === 0) {
            notification.error({
                message: 'Detalles vacíos',
                description: 'Debe agregar al menos un producto a la nota de ingreso'
            });
            return;
        }

        // Validar cantidades
        const invalidQuantity = nota.detalles.some(detalle => detalle.cantidad < 1);
        if (invalidQuantity) {
            notification.error({
                message: 'Cantidades inválidas',
                description: 'Todas las cantidades deben ser mayores a 0'
            });
            return;
        }

        setIsLoading(true);
        try {
            const data = {
                observacion: nota.observacion || 'Sin observación',
                detalles: nota.detalles,
            };

            let response;

            if (useMockData) {
                console.log("Creando nota de ingreso con mock");
                response = await mockApiCall('POST', '/notas-ingreso/', data);
            } else {
                response = await api.post('/notas-ingreso/', data);
            }

            notification.success({
                message: 'Nota de ingreso creada',
                description: `Se creó la nota ${response.data.numero_ingreso} con ${nota.detalles.length} productos`
            });

            refreshNotas();
            closeModal();
            resetForm();

        } catch (error) {
            console.error('Error al crear la nota de ingreso:', error);
            notification.error({
                message: 'Error al crear la nota de ingreso',
                description: error.response?.data?.message || error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Resetear formulario
    const resetForm = () => {
        setNota({
            observacion: '',
            detalles: [],
        });
    };

    // Probar diferentes escenarios
    const testScenario = (scenario) => {
        setUseMockData(true);
        resetForm();

        switch (scenario) {
            case 'single_product':
                setNota({
                    observacion: 'Ingreso de prueba - producto único',
                    detalles: [{ producto: 1, cantidad: 5 }]
                });
                break;
            case 'multiple_products':
                setNota({
                    observacion: 'Ingreso de prueba - múltiples productos',
                    detalles: [
                        { producto: 1, cantidad: 3 },
                        { producto: 2, cantidad: 10 },
                        { producto: 3, cantidad: 8 }
                    ]
                });
                break;
            case 'empty_observation':
                setNota({
                    observacion: '',
                    detalles: [{ producto: 1, cantidad: 2 }]
                });
                break;
            case 'large_quantity':
                setNota({
                    observacion: 'Ingreso de prueba - cantidad grande',
                    detalles: [{ producto: 1, cantidad: 100 }]
                });
                break;
            default:
                resetForm();
        }
    };

    const handleCancel = () => {
        resetForm();
        closeModal();
    };

    // Columnas para la tabla de productos seleccionados
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
            render: (productoId) => {
                const producto = productos.find(p => p.id === productoId);
                return producto ? (
                    <div>
                        <div className="font-medium">{producto.nombre}</div>
                        <div className="text-xs text-gray-500">
                            {producto.marca} • ${producto.precio}
                        </div>
                    </div>
                ) : 'Producto no encontrado';
            }
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
            width: 120,
            render: (cantidad, record) => (
                <Input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => handleCantidadChange(record.producto, e.target.value)}
                    style={{ width: 80 }}
                    disabled={isLoading}
                />
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveProducto(record.producto)}
                    disabled={isLoading}
                >
                    Eliminar
                </Button>
            )
        }
    ];

    const totalProductos = nota.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0);
    const totalProductosUnicos = nota.detalles.length;

    return (
        <Modal
            title={
                <div className="flex items-center justify-between">
                    <span>Crear Nota de Ingreso</span>
                    {useMockData && process.env.NODE_ENV === 'development' && (
                        <Tag color="orange">MODO PRUEBA</Tag>
                    )}
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={isLoading}>
                    Cancelar
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleCreateNota}
                    loading={isLoading}
                    disabled={nota.detalles.length === 0}
                    icon={<PlusOutlined />}
                >
                    Guardar Nota de Ingreso
                </Button>,
            ]}
            width={800}
            destroyOnClose
        >
            {/* Panel de control para desarrollo */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={useMockData}
                                onChange={(e) => setUseMockData(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Usar datos de prueba</span>
                        </label>
                    </div>

                    {useMockData && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-600 mb-1">Escenarios de prueba:</p>
                            <div className="flex flex-wrap gap-1">
                                <button
                                    type="button"
                                    onClick={() => testScenario('single_product')}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                    Producto Único
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('multiple_products')}
                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                >
                                    Múltiples Productos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('empty_observation')}
                                    className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                >
                                    Sin Observación
                                </button>
                                <button
                                    type="button"
                                    onClick={() => testScenario('large_quantity')}
                                    className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                                >
                                    Cantidad Grande
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {useMockData && process.env.NODE_ENV === 'development' && (
                <Alert
                    message="Modo Prueba Activado"
                    description="Los datos se están simulando localmente para desarrollo"
                    type="info"
                    showIcon
                    className="mb-4"
                />
            )}

            <div className="space-y-6">
                {/* Observación */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Observación:</h3>
                    <Input.TextArea
                        value={nota.observacion}
                        onChange={(e) => setNota({ ...nota, observacion: e.target.value })}
                        placeholder="Ingrese una observación para la nota de ingreso..."
                        rows={3}
                        disabled={isLoading}
                    />
                </div>

                {/* Selección de productos */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Agregar Productos:</h3>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Selecciona un producto para agregar"
                        onChange={handleAddProducto}
                        loading={isLoading}
                        disabled={isLoading}
                        optionLabelProp="label"
                    >
                        {productos.map((producto) => (
                            <Option
                                key={producto.id}
                                value={producto.id}
                                label={producto.nombre}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{producto.nombre}</span>
                                    <div className="text-xs text-gray-500">
                                        <Tag color="blue">{producto.categoria}</Tag>
                                        <span>${producto.precio}</span>
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </div>

                {/* Productos seleccionados */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Productos Seleccionados:</h3>
                        {nota.detalles.length > 0 && (
                            <div className="text-sm text-gray-600">
                                {totalProductosUnicos} productos • {totalProductos} unidades
                            </div>
                        )}
                    </div>

                    {nota.detalles.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500">No hay productos seleccionados</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Use el selector arriba para agregar productos
                            </p>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={nota.detalles}
                            rowKey="producto"
                            pagination={false}
                            size="small"
                            scroll={{ x: 500 }}
                        />
                    )}
                </div>

                {/* Información de mocks en desarrollo */}
                {process.env.NODE_ENV === 'development' && useMockData && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                        <p className="font-semibold mb-2">Productos mock disponibles:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_PRODUCTOS.map(producto => (
                                <div key={producto.id} className="border-l-2 border-blue-500 pl-2">
                                    <strong>ID {producto.id}:</strong> {producto.nombre}
                                    <br />
                                    <span className="text-gray-500">
                                        ${producto.precio} • Stock: {producto.stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default CreateNotaIngresoModal;
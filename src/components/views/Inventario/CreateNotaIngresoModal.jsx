import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

// Datos de prueba para simular productos
const mockProductos = [
    {
        id: 1,
        nombre: "Zapatillas Running Pro",
        precio: "89.99",
        categoria: "Calzado Deportivo",
        stock: 15
    },
    {
        id: 2,
        nombre: "Camiseta Deportiva",
        precio: "29.99",
        categoria: "Ropa Deportiva",
        stock: 25
    },
    {
        id: 3,
        nombre: "Short Deportivo",
        precio: "24.99",
        categoria: "Ropa Deportiva",
        stock: 30
    },
    {
        id: 4,
        nombre: "Medias Deportivas",
        precio: "12.99",
        categoria: "Accesorios",
        stock: 50
    },
    {
        id: 5,
        nombre: "Mochila Deportiva",
        precio: "45.99",
        categoria: "Accesorios",
        stock: 10
    }
];

// Datos de prueba para simular respuesta de nota de ingreso
const mockNotaIngresoResponse = {
    id: 1001,
    numero_ingreso: "NI-2024-001",
    fecha: "2024-01-15T10:30:00Z",
    observacion: "Ingreso de productos deportivos",
    total_productos: 5,
    detalles: [
        {
            producto: 1,
            cantidad: 10,
            precio_unitario: 89.99
        },
        {
            producto: 2,
            cantidad: 20,
            precio_unitario: 29.99
        }
    ]
};

function CreateNotaIngresoModal({ visible, closeModal, refreshNotas }) {
    const [productos, setProductos] = useState([]);
    const [nota, setNota] = useState({
        observacion: '',
        detalles: [], // Detalles de los productos seleccionados
    });

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get('/productos/');
            const response = { data: mockProductos }; // Simulación temporal
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    // Función para manejar la selección de producto
    const handleAddProducto = (productoId) => {
        // Verificar si el producto ya está seleccionado
        if (!nota.detalles.some((detalle) => detalle.producto === productoId)) {
            setNota((prevNota) => ({
                ...prevNota,
                detalles: [
                    ...prevNota.detalles,
                    { producto: productoId, cantidad: 1 }, // Valor inicial de cantidad
                ],
            }));
        }
    };

    // Función para manejar la actualización de la cantidad
    const handleCantidadChange = (productoId, cantidad) => {
        setNota((prevNota) => ({
            ...prevNota,
            detalles: prevNota.detalles.map((detalle) =>
                detalle.producto === productoId
                    ? { ...detalle, cantidad: parseInt(cantidad) }
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
        try {
            const data = {
                observacion: nota.observacion,
                detalles: nota.detalles,
            };

            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // await api.post('/notas-ingreso/', data);
            console.log("Nota de ingreso creada exitosamente:", data); // Simulación temporal

            refreshNotas(); // Refrescar la lista de notas en el componente principal
            closeModal(); // Cerrar el modal

            // Limpiar el formulario después de crear
            setNota({
                observacion: '',
                detalles: [],
            });
        } catch (error) {
            console.error('Error al crear la nota de ingreso:', error);
        }
    };

    return (
        <Modal
            title="Crear Nota de Ingreso"
            visible={visible}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateNota}>
                    Guardar Nota de Ingreso
                </Button>,
            ]}
        >
            <div>
                <h3>Observación:</h3>
                <Input
                    value={nota.observacion}
                    onChange={(e) => setNota({ ...nota, observacion: e.target.value })}
                    placeholder="Ingrese una observación"
                />

                <div className="mt-4">
                    <h3>Seleccione Productos:</h3>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Selecciona un producto"
                        onChange={handleAddProducto}
                    >
                        {productos.map((producto) => (
                            <Option key={producto.id} value={producto.id}>
                                {producto.nombre} (Precio: {producto.precio})
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="mt-4">
                    <h3>Productos Seleccionados:</h3>
                    {nota.detalles.map((detalle) => (
                        <div key={detalle.producto} className="mb-4">
                            <Space style={{ width: '100%' }} align="baseline">
                                <span>{productos.find((p) => p.id === detalle.producto)?.nombre}</span>
                                <Input
                                    type="number"
                                    min="1"
                                    value={detalle.cantidad}
                                    onChange={(e) =>
                                        handleCantidadChange(detalle.producto, e.target.value)
                                    }
                                    style={{ width: 80 }}
                                />
                                <Button
                                    type="link"
                                    onClick={() => handleRemoveProducto(detalle.producto)}
                                >
                                    Eliminar
                                </Button>
                            </Space>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

export default CreateNotaIngresoModal;
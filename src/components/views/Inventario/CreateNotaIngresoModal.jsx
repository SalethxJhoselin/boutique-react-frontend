import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Option } = Select;

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
            const response = await api.get('/productos/');
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

            await api.post('/notas-ingreso/', data);
            refreshNotas(); // Refrescar la lista de notas en el componente principal
            closeModal(); // Cerrar el modal
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

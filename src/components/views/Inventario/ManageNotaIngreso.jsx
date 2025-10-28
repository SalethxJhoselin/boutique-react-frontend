import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import api from '../../../api/apiServices';
import CreateNotaIngresoModal from './CreateNotaIngresoModal'; // Importa el componente del modal

const ManageNotaIngreso = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notas, setNotas] = useState([]); // Para almacenar las notas de ingreso

    // Obtener notas de ingreso desde la API
    useEffect(() => {
        const fetchNotas = async () => {
            try {
                const response = await api.get('/notas-ingreso');
                setNotas(response.data); // Guardar las notas recibidas
            } catch (error) {
                console.error('Error fetching notas de ingreso:', error);
            }
        };

        fetchNotas();
    }, []);

    // Función para abrir el modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalVisible(false);
    };

    // Función para refrescar las notas (esto puede ser un fetch a las notas de ingreso)
    const refreshNotas = () => {
        // Rehacer el fetch de las notas para actualizarlas
        const fetchNotas = async () => {
            try {
                const response = await api.get('/notas-ingreso');
                setNotas(response.data); // Guardar las notas recibidas
            } catch (error) {
                console.error('Error fetching notas de ingreso:', error);
            }
        };
        fetchNotas();
    };

    // Definir las columnas de la tabla
    const columns = [
        {
            title: 'Observación',
            dataIndex: 'observacion',
            key: 'observacion',
        },
        {
            title: 'Detalles',
            dataIndex: 'detalles',
            key: 'detalles',
            render: (detalles) => (
                <ul>
                    {detalles.map((detalle, index) => (
                        <li key={index}>
                            Producto {detalle.producto}: {detalle.cantidad} unidades
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestión de Notas de Ingreso</h2>

            {/* Botón para abrir el modal */}
            <Button
                type="primary"
                icon={<FaPlus />}
                onClick={showModal}
            >
                Crear Nota de Ingreso
            </Button>

            {/* Modal que se abre cuando se hace clic en el botón */}
            <CreateNotaIngresoModal
                visible={isModalVisible}
                closeModal={closeModal}
                refreshNotas={refreshNotas}
            />

            {/* Tabla de notas de ingreso con scroll */}
            <Table
                columns={columns}
                dataSource={notas}
                rowKey="observacion"
                pagination={false}
                className="mt-6"
                scroll={{ y: 400 }} // Establece el scroll vertical con un tamaño máximo de 400px
            />
        </div>
    );
};

export default ManageNotaIngreso;

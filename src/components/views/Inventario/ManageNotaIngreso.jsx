import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateNotaIngresoModal from './CreateNotaIngresoModal'; // Importa el componente del modal

// Datos de prueba para simular notas de ingreso
const mockNotasIngreso = [
    {
        id: 1,
        observacion: "Ingreso de productos deportivos de temporada",
        detalles: [
            { producto: 1, cantidad: 10, precio_unitario: 89.99 },
            { producto: 2, cantidad: 20, precio_unitario: 29.99 },
            { producto: 3, cantidad: 15, precio_unitario: 24.99 }
        ],
        fecha: "2024-01-15T10:30:00Z",
        numero_ingreso: "NI-2024-001"
    },
    {
        id: 2,
        observacion: "Reposición de stock de accesorios",
        detalles: [
            { producto: 4, cantidad: 50, precio_unitario: 12.99 },
            { producto: 5, cantidad: 8, precio_unitario: 45.99 }
        ],
        fecha: "2024-01-14T14:20:00Z",
        numero_ingreso: "NI-2024-002"
    },
    {
        id: 3,
        observacion: "Ingreso de nueva línea de running",
        detalles: [
            { producto: 1, cantidad: 5, precio_unitario: 89.99 },
            { producto: 2, cantidad: 10, precio_unitario: 29.99 },
            { producto: 4, cantidad: 25, precio_unitario: 12.99 }
        ],
        fecha: "2024-01-12T09:15:00Z",
        numero_ingreso: "NI-2024-003"
    },
    {
        id: 4,
        observacion: "Stock para promoción especial",
        detalles: [
            { producto: 3, cantidad: 30, precio_unitario: 24.99 },
            { producto: 5, cantidad: 12, precio_unitario: 45.99 }
        ],
        fecha: "2024-01-10T16:45:00Z",
        numero_ingreso: "NI-2024-004"
    },
    {
        id: 5,
        observacion: "Ingreso mensual de productos básicos",
        detalles: [
            { producto: 2, cantidad: 25, precio_unitario: 29.99 },
            { producto: 4, cantidad: 40, precio_unitario: 12.99 }
        ],
        fecha: "2024-01-08T11:30:00Z",
        numero_ingreso: "NI-2024-005"
    }
];

const ManageNotaIngreso = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notas, setNotas] = useState([]); // Para almacenar las notas de ingreso

    // Obtener notas de ingreso desde la API
    useEffect(() => {
        const fetchNotas = async () => {
            try {
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await api.get('/notas-ingreso');
                const response = { data: mockNotasIngreso }; // Simulación temporal
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
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await api.get('/notas-ingreso');
                const response = { data: mockNotasIngreso }; // Simulación temporal
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
                rowKey="id"
                pagination={false}
                className="mt-6"
                scroll={{ y: 400 }} // Establece el scroll vertical con un tamaño máximo de 400px
            />
        </div>
    );
};

export default ManageNotaIngreso;
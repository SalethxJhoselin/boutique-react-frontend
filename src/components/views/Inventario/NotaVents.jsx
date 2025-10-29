import { Table } from 'antd';
import { useEffect, useState } from 'react';

// Datos de prueba para simular notas de venta
const mockNotasVenta = [
    {
        id: 1,
        fecha: "2024-01-15T10:30:00Z",
        observacion: "Compra online - Cliente frecuente",
        usuario: 1,
        total: 189.97
    },
    {
        id: 2,
        fecha: "2024-01-14T14:20:00Z",
        observacion: "Venta en tienda física",
        usuario: 2,
        total: 75.50
    },
    {
        id: 3,
        fecha: "2024-01-13T16:45:00Z",
        observacion: "Compra con descuento promocional",
        usuario: 3,
        total: 120.25
    },
    {
        id: 4,
        fecha: "2024-01-12T09:15:00Z",
        observacion: "Pedido corporativo",
        usuario: 4,
        total: 350.80
    },
    {
        id: 5,
        fecha: "2024-01-11T11:30:00Z",
        observacion: "Compra mayorista",
        usuario: 5,
        total: 520.45
    }
];

// Datos de prueba para simular detalles de venta
const mockDetallesVenta = [
    // Detalles para nota de venta 1
    { id: 1, nota_venta: 1, producto: 1, cantidad: 2, precio_unitario: 89.99 },
    { id: 2, nota_venta: 1, producto: 4, cantidad: 1, precio_unitario: 9.99 },

    // Detalles para nota de venta 2
    { id: 3, nota_venta: 2, producto: 2, cantidad: 1, precio_unitario: 29.99 },
    { id: 4, nota_venta: 2, producto: 3, cantidad: 1, precio_unitario: 24.99 },
    { id: 5, nota_venta: 2, producto: 4, cantidad: 2, precio_unitario: 12.99 },

    // Detalles para nota de venta 3
    { id: 6, nota_venta: 3, producto: 1, cantidad: 1, precio_unitario: 89.99 },
    { id: 7, nota_venta: 3, producto: 5, cantidad: 1, precio_unitario: 45.99 },

    // Detalles para nota de venta 4
    { id: 8, nota_venta: 4, producto: 2, cantidad: 5, precio_unitario: 29.99 },
    { id: 9, nota_venta: 4, producto: 3, cantidad: 3, precio_unitario: 24.99 },
    { id: 10, nota_venta: 4, producto: 4, cantidad: 10, precio_unitario: 12.99 },

    // Detalles para nota de venta 5
    { id: 11, nota_venta: 5, producto: 1, cantidad: 4, precio_unitario: 89.99 },
    { id: 12, nota_venta: 5, producto: 2, cantidad: 3, precio_unitario: 29.99 },
    { id: 13, nota_venta: 5, producto: 5, cantidad: 2, precio_unitario: 45.99 }
];

const NotaVentas = () => {
    const [notas, setNotas] = useState([]); // Para almacenar las notas de venta
    const [detalles, setDetalles] = useState([]); // Para almacenar los detalles de las ventas
    const [data, setData] = useState([]); // Datos combinados para la tabla

    // Obtener notas de venta y detalles de venta desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // SIMULACIÓN: Reemplazar estas líneas con las peticiones reales cuando estén disponibles
                // const notasResponse = await api.get('/notas-venta/');
                // const detallesResponse = await api.get('/detalles-venta/');

                // Simulación temporal
                const notasResponse = { data: mockNotasVenta };
                const detallesResponse = { data: mockDetallesVenta };

                setNotas(notasResponse.data);
                setDetalles(detallesResponse.data);

                // Combinar notas y detalles
                const combinedData = notasResponse.data.map(nota => ({
                    ...nota,
                    detalles: detallesResponse.data.filter(detalle => detalle.nota_venta === nota.id),
                }));
                setData(combinedData);
            } catch (error) {
                console.error('Error fetching notas y detalles de venta:', error);
            }
        };

        fetchData();
    }, []);

    // Definir las columnas de la tabla
    const columns = [
        {
            title: 'ID Nota de Venta',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            render: (fecha) => new Date(fecha).toLocaleString(), // Formatear la fecha
        },
        {
            title: 'Observación',
            dataIndex: 'observacion',
            key: 'observacion',
        },
        {
            title: 'Detalles de Productos',
            dataIndex: 'detalles',
            key: 'detalles',
            render: (detalles) => (
                <ul>
                    {detalles.map((detalle, index) => (
                        <li key={index}>
                            Producto ID: {detalle.producto}, Cantidad: {detalle.cantidad}
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestión de Notas de Venta</h2>

            {/* Tabla de notas de venta */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id" // Asegúrate de que cada nota tenga un campo `id`
                pagination={{ pageSize: 10 }} // Paginación con 10 elementos por página
                className="mt-6"
                scroll={{ y: 400 }} // Establece el scroll vertical con un tamaño máximo de 400px
            />
        </div>
    );
};

export default NotaVentas;
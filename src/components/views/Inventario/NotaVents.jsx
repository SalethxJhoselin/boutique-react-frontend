import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import api from '../../../api/apiServices';

const NotaVentas = () => {
    const [notas, setNotas] = useState([]); // Para almacenar las notas de venta
    const [detalles, setDetalles] = useState([]); // Para almacenar los detalles de las ventas
    const [data, setData] = useState([]); // Datos combinados para la tabla

    // Obtener notas de venta y detalles de venta desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const notasResponse = await api.get('/notas-venta/');
                const detallesResponse = await api.get('/detalles-venta/');
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

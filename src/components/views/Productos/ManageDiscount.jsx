import { useEffect, useState } from 'react';
import InputModal from './InputModal';

// Datos de prueba para simular descuentos
const mockDiscounts = [
    { id: 1, nombre: "Descuento de Verano", porcentaje: 15 },
    { id: 2, nombre: "Oferta Especial", porcentaje: 20 },
    { id: 3, nombre: "Descuento por Temporada", porcentaje: 10 },
    { id: 4, nombre: "Promoción de Lanzamiento", porcentaje: 25 },
    { id: 5, nombre: "Descuento para Miembros", porcentaje: 5 },
    { id: 6, nombre: "Oferta Flash", porcentaje: 30 },
    { id: 7, nombre: "Descuento por Volumen", porcentaje: 12 }
];

const ManageDiscount = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editPorcentaje, setEditPorcentaje] = useState('');

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/discount");
            const response = { data: mockDiscounts }; // Simulación temporal
            console.log("response.data");
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.log("error al obtener los datos", error);
        }
    }
    useEffect(() => {
        getDatos();
    }, [])


    const handleNameSubmit = async (name) => {
        if (name.nombre && name.nombre.trim() !== "") {
            try {
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await api.post("/discount", name);

                // Simulación temporal - agregar descuento localmente
                const newDiscount = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: name.nombre,
                    porcentaje: name.porcentaje || 0
                };
                setData(prevData => [...prevData, newDiscount]);

                console.log("Se creó");
                getDatos(); // Refrescar la lista de descuentos
            } catch (error) {
                console.error("No se creó", error.response?.data);
            }
        } else {
            console.log("El nombre no es válido");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);  // Establece el ID del elemento que está siendo editado
        setEditDescripcion(item.nombre);
        setEditPorcentaje(item.porcentaje);
    };

    const handleSave = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.put(`/discount`, {
            //     id: id,
            //     nombre: editDescripcion,
            //     porcentaje: editPorcentaje
            // });

            // Simulación temporal - actualizar localmente
            setData(prevData =>
                prevData.map(item =>
                    item.id === id
                        ? { ...item, nombre: editDescripcion, porcentaje: parseInt(editPorcentaje) }
                        : item
                )
            );

            getDatos();
            setEditId(null);
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar el descuento', error.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.delete(`/discount/${id}`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));

            getDatos();
            setEditId(null);
            console.log('Eliminacion exitosa');
        } catch (error) {
            console.error('Error al eliminar el descuento', error.response?.data);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Descuentos</h2>
            <InputModal initialValue="descuento" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Porcentaje</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="text"
                                        value={editDescripcion}
                                        onChange={(e) => setEditDescripcion(e.target.value)}
                                    />
                                ) : (
                                    item.nombre
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="number"
                                        value={editPorcentaje}
                                        onChange={(e) => setEditPorcentaje(e.target.value)}
                                    />
                                ) : (
                                    `${item.porcentaje}%`
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <>
                                        <button onClick={() => handleSave(item.id)}>Guardar</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="edit-btn" onClick={() => handleEdit(item)}>Editar</button>
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDiscount;
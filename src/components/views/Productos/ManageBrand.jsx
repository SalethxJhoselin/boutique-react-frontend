import { useEffect, useState } from 'react';
import InputModal from './InputModal';

// Datos de prueba para simular marcas
const mockMarcas = [
    { id: 1, nombre: "Nike" },
    { id: 2, nombre: "Adidas" },
    { id: 3, nombre: "Puma" },
    { id: 4, nombre: "Reebok" },
    { id: 5, nombre: "Under Armour" },
    { id: 6, nombre: "New Balance" },
    { id: 7, nombre: "Asics" }
];

const ManageBrand = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/marcas/");
            const response = { data: mockMarcas }; // Simulación temporal
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
                // const response = await api.post("/marcas/", { nombre: name.nombre });

                // Simulación temporal - agregar marca localmente
                const newBrand = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: name.nombre
                };
                setData(prevData => [...prevData, newBrand]);

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
        setEditId(item.id);
        setEditDescripcion(item.nombre);
    };

    const handleSave = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.put(`/marcas/${id}/`, {
            //     nombre: editDescripcion
            // });

            // Simulación temporal - actualizar localmente
            setData(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, nombre: editDescripcion } : item
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
            // const response = await api.delete(`/marcas/${id}/`);

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
            <h2 className="text-3xl text-center mb-3">Gestionar Marcas</h2>
            <InputModal initialValue="brand" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Marca</th>
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

export default ManageBrand;
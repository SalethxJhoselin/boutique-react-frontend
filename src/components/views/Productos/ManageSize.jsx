import { useEffect, useState } from 'react';
import InputModal from './InputModal';

// Datos de prueba para simular tallas
const mockTallas = [
    { id: 1, nombre: "XS" },
    { id: 2, nombre: "S" },
    { id: 3, nombre: "M" },
    { id: 4, nombre: "L" },
    { id: 5, nombre: "XL" },
    { id: 6, nombre: "XXL" },
    { id: 7, nombre: "28" },
    { id: 8, nombre: "30" },
    { id: 9, nombre: "32" },
    { id: 10, nombre: "34" },
    { id: 11, nombre: "36" },
    { id: 12, nombre: "38" },
    { id: 13, nombre: "40" },
    { id: 14, nombre: "42" },
    { id: 15, nombre: "Única" }
];

const ManageSize = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/tallas/");
            const response = { data: mockTallas }; // Simulación temporal
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
                // const response = await api.post("/tallas/", {nombre: name.nombre});

                // Simulación temporal - agregar talla localmente
                const newSize = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: name.nombre
                };
                setData(prevData => [...prevData, newSize]);

                console.log("Se creó");
                getDatos(); // Refrescar la lista de tallas
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
    };

    const handleSave = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.put(`/tallas/${id}/`, {
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
            console.error('Error al actualizar la talla', error.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.delete(`/tallas/${id}/`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));

            getDatos();
            setEditId(null);
            console.log('Eliminacion exitosa');
        } catch (error) {
            console.error('Error al eliminar la talla', error.response?.data);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Tallas</h2>
            <InputModal initialValue="size" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Talla</th>
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

export default ManageSize;
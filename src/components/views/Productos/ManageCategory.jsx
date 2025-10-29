import { useEffect, useState } from 'react';
import InputModal from './InputModal';

// Datos de prueba para simular categorías
const mockCategorias = [
    { id: 1, nombre: "Calzado Deportivo" },
    { id: 2, nombre: "Ropa Deportiva" },
    { id: 3, nombre: "Accesorios" },
    { id: 4, nombre: "Equipamiento" },
    { id: 5, nombre: "Suplementos" },
    { id: 6, nombre: "Natación" },
    { id: 7, nombre: "Running" }
];

const ManageCategory = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/categorias/");
            const response = { data: mockCategorias }; // Simulación temporal
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
                // const response = await api.post("/categorias/", { nombre: name.nombre });

                // Simulación temporal - agregar categoría localmente
                const newCategory = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: name.nombre
                };
                setData(prevData => [...prevData, newCategory]);

                console.log("Se creó");
                getDatos(); // Refrescar la lista de categorías
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
            // const response = await api.put(`/categorias/${id}/`, {
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
            console.error('Error al actualizar la categoría', error.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.delete(`/categorias/${id}/`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));

            getDatos();
            setEditId(null);
            console.log('Eliminacion exitosa');
        } catch (error) {
            console.error('Error al eliminar la categoría', error.response?.data);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Categorias</h2>
            <InputModal initialValue="category" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Categoria</th>
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

export default ManageCategory;
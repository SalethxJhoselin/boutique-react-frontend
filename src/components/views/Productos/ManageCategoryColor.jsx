import { useEffect, useState } from 'react';
import InputModal from './InputModal';

// Datos de prueba para simular categorías de colores
const mockCategoriasColores = [
    { id: 1, nombre: "Colores Básicos" },
    { id: 2, nombre: "Colores Deportivos" },
    { id: 3, nombre: "Colores de Temporada" },
    { id: 4, nombre: "Colores Neutros" },
    { id: 5, nombre: "Colores Vibrantes" },
    { id: 6, nombre: "Colores Pastel" },
    { id: 7, nombre: "Colores Metálicos" }
];

const ManageCategoryColor = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/categorias-colores/");
            const response = { data: mockCategoriasColores }; // Simulación temporal
            console.log("response.data", response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error al obtener los datos", error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);

    const handleNameSubmit = async (name) => {
        if (name.nombre && name.nombre.trim() !== "") {
            try {
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await api.post("/categorias-colores/", { nombre: name.nombre });

                // Simulación temporal - agregar categoría de color localmente
                const newCategoryColor = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: name.nombre
                };
                setData(prevData => [...prevData, newCategoryColor]);

                console.log("Categoría creada");
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
            // const response = await api.put(`/categorias-colores/${id}/`, {
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
            // const response = await api.delete(`/categorias-colores/${id}/`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));

            getDatos();
            setEditId(null);
            console.log('Eliminación exitosa');
        } catch (error) {
            console.error('Error al eliminar la categoría', error.response?.data);
        }
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Categorías de Colores</h2>
            <InputModal initialValue="categoria-color" onSubmit={handleNameSubmit} />
            <table className="discount-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Categoría</th>
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

export default ManageCategoryColor;
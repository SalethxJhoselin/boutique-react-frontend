import React, { useState, useEffect } from 'react';
import InputModal from './InputModal';
import api from '../../../api/apiServices';

const ManageCategoryColor = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');

    const getDatos = async () => {
        try {
            const response = await api.get("/categorias-colores/"); // Cambié el endpoint a categorías de colores
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
                const response = await api.post("/categorias-colores/", { nombre: name.nombre }); // Endpoint para agregar categoría
                console.log("Categoría creada");
                console.log(response);
                getDatos(); // Refrescar la lista de categorías
            } catch (error) {
                console.error("No se creó", error.response?.data);
            }
        } else {
            message.log("El nombre no es válido");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);  // Establece el ID del elemento que está siendo editado
        setEditDescripcion(item.nombre);
    };

    const handleSave = async (id) => {
        try {
            const response = await api.put(`/categorias-colores/${id}/`, {
                nombre: editDescripcion
            });
            getDatos();
            setEditId(null);
            console.log('Actualización exitosa', response);
        } catch (error) {
            console.error('Error al actualizar la categoría', error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/categorias-colores/${id}/`); // Endpoint para eliminar categoría
            getDatos();
            setEditId(null);
            console.log('Eliminación exitosa', response);
        } catch (error) {
            console.error('Error al eliminar la categoría', error.response.data);
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

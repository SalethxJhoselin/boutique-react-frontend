import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';
import InputModal from './InputModal';

const ManageDiscount = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editPorcentaje, setEditPorcentaje] = useState('');

    const getDatos = async () => {
        try {
            const response = await api.get("/discount");
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
                const response = await api.post("/discount", name); // Enviar el nombre en el cuerpo del POST
                console.log("Se creó");
                console.log(response);
                getDatos(); // Refrescar la lista de descuentos
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
        setEditPorcentaje(item.porcentaje);
    };

    const handleSave = async (id) => {
        try {
            const response = await api.put(`/discount`, {
                id: id,
                nombre: editDescripcion,
                porcentaje: editPorcentaje
            });
            getDatos();
            setEditId(null);
            console.log('Actualización exitosa', response);
        } catch (error) {
            console.error('Error al actualizar el descuento', error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/discount/${id}`);
            getDatos();
            setEditId(null);
            console.log('Eliminacion exitosa', response);
        } catch (error) {
            console.error('Error al eliminar el descuento', error.response.data);
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
                                    item.porcentaje
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

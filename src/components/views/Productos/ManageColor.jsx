import { Button, Input, Modal, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../../api/apiServices';

const { Option } = Select;

const ManageColor = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getDatos = async () => {
        try {
            const response = await api.get("/colores/");
            setData(response.data);
        } catch (error) {
            console.log("Error al obtener los datos", error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await api.get("/categorias-colores/");
            setCategories(response.data);
        } catch (error) {
            console.log("Error al obtener las categorías", error);
        }
    };

    useEffect(() => {
        getDatos();
        getCategories();
    }, []);

    const handleCategoryChange = (value) => {
        setSelectedCategories(value);
    };

    const handleNameSubmit = async () => {
        if (editDescripcion.trim() !== "") {
            try {
                const response = await api.post("/colores/", {
                    nombre: editDescripcion,
                    categorias: selectedCategories,
                });
                setIsModalVisible(false);
                getDatos();
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
        setSelectedCategories(item.categorias); // Asignar categorías ya seleccionadas al editar
    };

    const handleSave = async (id) => {
        try {
            const response = await api.put(`/colores/${id}/`, {
                nombre: editDescripcion,
                categorias: selectedCategories,
            });
            getDatos();
            setEditId(null);
            console.log('Actualización exitosa', response);
        } catch (error) {
            console.error('Error al actualizar el color', error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/colores/${id}/`);
            getDatos();
            setEditId(null);
            console.log('Eliminación exitosa', response);
        } catch (error) {
            console.error('Error al eliminar el color', error.response.data);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Color',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text, record) => (
                editId === record.id ? (
                    <Input
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                    />
                ) : (
                    text
                )
            ),
        },
        {
            title: 'Categorías',
            dataIndex: 'categorias',
            key: 'categorias',
            render: (categorias, record) => (
                editId === record.id ? (
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                                {category.nombre}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    categorias.map((catId) => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <span key={catId}>{category.nombre} </span> : null;
                    })
                )
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                editId === record.id ? (
                    <Button type="primary" onClick={() => handleSave(record.id)}>
                        Guardar
                    </Button>
                ) : (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)}>
                            Editar
                        </Button>
                        <Button type="link" danger onClick={() => handleDelete(record.id)}>
                            Eliminar
                        </Button>
                    </>
                )
            ),
        },
    ];

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Colores</h2>
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 20 }}>
                Añadir Color
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={false}
            />
            <Modal
                title="Crear Nuevo Color"
                visible={isModalVisible}
                onOk={handleNameSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Input
                    placeholder="Nombre del color"
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Selecciona las categorías"
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                >
                    {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                            {category.nombre}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default ManageColor;

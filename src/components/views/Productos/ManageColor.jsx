import { Button, Input, Modal, Select, Table } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

// Datos de prueba para simular colores
const mockColores = [
    { id: 1, nombre: "Negro", categorias: [1, 2] },
    { id: 2, nombre: "Blanco", categorias: [1, 4] },
    { id: 3, nombre: "Rojo", categorias: [2, 5] },
    { id: 4, nombre: "Azul", categorias: [2, 3] },
    { id: 5, nombre: "Verde", categorias: [2, 6] },
    { id: 6, nombre: "Gris", categorias: [1, 4] },
    { id: 7, nombre: "Amarillo", categorias: [5, 6] }
];

// Datos de prueba para simular categorías de colores
const mockCategoriasColores = [
    { id: 1, nombre: "Colores Básicos" },
    { id: 2, nombre: "Colores Deportivos" },
    { id: 3, nombre: "Colores de Temporada" },
    { id: 4, nombre: "Colores Neutros" },
    { id: 5, nombre: "Colores Vibrantes" },
    { id: 6, nombre: "Colores Pastel" }
];

const ManageColor = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/colores/");
            const response = { data: mockColores }; // Simulación temporal
            setData(response.data);
        } catch (error) {
            console.log("Error al obtener los datos", error);
        }
    };

    const getCategories = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/categorias-colores/");
            const response = { data: mockCategoriasColores }; // Simulación temporal
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
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await api.post("/colores/", {
                //     nombre: editDescripcion,
                //     categorias: selectedCategories,
                // });

                // Simulación temporal - agregar color localmente
                const newColor = {
                    id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                    nombre: editDescripcion,
                    categorias: selectedCategories
                };
                setData(prevData => [...prevData, newColor]);

                setIsModalVisible(false);
                setEditDescripcion('');
                setSelectedCategories([]);
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
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.put(`/colores/${id}/`, {
            //     nombre: editDescripcion,
            //     categorias: selectedCategories,
            // });

            // Simulación temporal - actualizar localmente
            setData(prevData =>
                prevData.map(item =>
                    item.id === id
                        ? { ...item, nombre: editDescripcion, categorias: selectedCategories }
                        : item
                )
            );

            getDatos();
            setEditId(null);
            setEditDescripcion('');
            setSelectedCategories([]);
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar el color', error.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.delete(`/colores/${id}/`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));

            getDatos();
            setEditId(null);
            console.log('Eliminación exitosa');
        } catch (error) {
            console.error('Error al eliminar el color', error.response?.data);
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
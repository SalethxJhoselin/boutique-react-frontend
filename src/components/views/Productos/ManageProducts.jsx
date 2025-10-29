import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import CreateProduct from './CreateProduct';

// Datos de prueba para simular productos
const mockProducts = [
    {
        id: 1,
        nombre: "Zapatillas Running Pro",
        descripcion: "Zapatillas profesionales para running con amortiguación avanzada",
        precio: 89.99,
        stock: 15,
        categoria: "Calzado Deportivo",
        marca: "Nike",
        colores: ["Negro", "Blanco", "Rojo"],
        tallas: ["38", "39", "40", "41", "42"],
        fecha_agregado: "2024-01-15T10:30:00Z",
        imagen_url: "https://via.placeholder.com/300x300.png?text=Zapatillas+Running"
    },
    {
        id: 2,
        nombre: "Camiseta Deportiva",
        descripcion: "Camiseta técnica para entrenamiento con tecnología dry-fit",
        precio: 29.99,
        stock: 25,
        categoria: "Ropa Deportiva",
        marca: "Adidas",
        colores: ["Blanco", "Negro", "Azul"],
        tallas: ["S", "M", "L", "XL"],
        fecha_agregado: "2024-01-14T14:20:00Z",
        imagen_url: "https://via.placeholder.com/300x300.png?text=Camiseta+Deportiva"
    },
    {
        id: 3,
        nombre: "Short Deportivo",
        descripcion: "Short ligero para actividades deportivas con tejido transpirable",
        precio: 24.99,
        stock: 30,
        categoria: "Ropa Deportiva",
        marca: "Puma",
        colores: ["Azul marino", "Negro", "Gris"],
        tallas: ["S", "M", "L", "XL"],
        fecha_agregado: "2024-01-13T16:45:00Z",
        imagen_url: "https://via.placeholder.com/300x300.png?text=Short+Deportivo"
    },
    {
        id: 4,
        nombre: "Medias Deportivas",
        descripcion: "Medias técnicas con soporte para el arco plantar",
        precio: 12.99,
        stock: 50,
        categoria: "Accesorios",
        marca: "Reebok",
        colores: ["Blanco", "Negro", "Gris"],
        tallas: ["Única"],
        fecha_agregado: "2024-01-12T09:15:00Z",
        imagen_url: "https://via.placeholder.com/300x300.png?text=Medias+Deportivas"
    },
    {
        id: 5,
        nombre: "Mochila Deportiva",
        descripcion: "Mochila resistente al agua con compartimento para laptop",
        precio: 45.99,
        stock: 10,
        categoria: "Accesorios",
        marca: "Under Armour",
        colores: ["Negro", "Azul", "Verde"],
        tallas: ["Única"],
        fecha_agregado: "2024-01-11T11:30:00Z",
        imagen_url: "https://via.placeholder.com/300x300.png?text=Mochila+Deportiva"
    }
];

const ManageProduct = () => {
    const [data, setData] = useState([]);
    const [productDetails, setProductDetails] = useState(null); // Estado para guardar los detalles del producto
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    // URL de la imagen vacía (puedes reemplazarla por una imagen de tu preferencia)
    const placeholderImage = 'https://via.placeholder.com/300x300.png?text=Sin+Imagen';

    // Obtener la lista de productos
    const getDatos = async () => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // const response = await api.get("/productos/");
            const response = { data: mockProducts }; // Simulación temporal
            console.log("Productos obtenidos:", response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error al obtener los datos", error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);

    // Función para eliminar producto (simulada)
    const handleDelete = async (id) => {
        try {
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // await api.delete(`/productos/${id}/`);

            // Simulación temporal - eliminar localmente
            setData(prevData => prevData.filter(item => item.id !== id));
            console.log(`Producto con ID ${id} eliminado`);
        } catch (error) {
            console.error("Error al eliminar el producto", error);
        }
    };

    // Mostrar los detalles del producto en el modal
    const showProductDetails = (item) => {
        setProductDetails(item);
        setIsModalVisible(true); // Mostrar el modal
    };

    // Cerrar el modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setProductDetails(null);
    };

    return (
        <div className="table-container">
            <h2 className="text-3xl text-center mb-3">Gestionar Productos</h2>
            <CreateProduct />
            <table className="product-table w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Stock</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">{item.nombre}</td>
                            <td className="border px-4 py-2">${item.precio}</td>
                            <td className="border px-4 py-2">{item.stock}</td>
                            <td className="border px-4 py-2">
                                <button className="view-details-btn bg-blue-500 text-black px-3 py-1 rounded" onClick={() => showProductDetails(item)}>Ver detalles</button>
                                <button className="delete-btn bg-red-500 text-white px-3 py-1 rounded ml-2" onClick={() => handleDelete(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de detalles del producto */}
            <Modal
                title="Detalles del Producto"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>Cerrar</Button>
                ]}
            >
                {productDetails && (
                    <div>
                        <h3>Nombre: {productDetails.nombre}</h3>
                        <p><strong>Descripción:</strong> {productDetails.descripcion || 'N/A'}</p>
                        <p><strong>Precio:</strong> ${productDetails.precio}</p>
                        <p><strong>Stock:</strong> {productDetails.stock}</p>
                        <p><strong>Categoría:</strong> {productDetails.categoria || 'N/A'}</p>
                        <p><strong>Marca:</strong> {productDetails.marca || 'N/A'}</p>

                        {/* Mostrar colores si existen */}
                        <p><strong>Colores:</strong> {productDetails.colores.length > 0 ? productDetails.colores.join(', ') : 'No disponibles'}</p>

                        {/* Mostrar tallas si existen */}
                        <p><strong>Tallas:</strong>
                            {productDetails.tallas.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {productDetails.tallas.map((talla, index) => (
                                        <span key={index} className="border border-gray-300 px-3 py-1 rounded">{talla}</span>
                                    ))}
                                </div>
                            ) : 'No disponibles'}
                        </p>

                        {/* Mostrar fecha de agregado */}
                        <p><strong>Fecha Agregado:</strong> {new Date(productDetails.fecha_agregado).toLocaleDateString()}</p>

                        {/* Mostrar imagen si existe, si no, imagen vacía */}
                        <div>
                            <img
                                src={productDetails.imagen_url || placeholderImage}
                                alt="Imagen del producto"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageProduct;
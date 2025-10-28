import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import api from '../../../api/apiServices';
import CreateProduct from './CreateProduct';

const ManageProduct = () => {
    const [data, setData] = useState([]);
    const [productDetails, setProductDetails] = useState(null); // Estado para guardar los detalles del producto
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    // URL de la imagen vacía (puedes reemplazarla por una imagen de tu preferencia)
    const placeholderImage = 'https://via.placeholder.com/300x300.png?text=Sin+Imagen';

    // Obtener la lista de productos
    const getDatos = async () => {
        try {
            const response = await api.get("/productos/");
            console.log("Productos obtenidos:", response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error al obtener los datos", error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);

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
            <CreateProduct  />
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
                            <td className="border px-4 py-2">{item.precio}</td>
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

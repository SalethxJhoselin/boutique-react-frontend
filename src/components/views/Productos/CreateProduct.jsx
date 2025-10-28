import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { Modal, Input, Button, Select, Spin, Upload, message } from 'antd';
import api from '../../../api/apiServices';

const { Option } = Select;

const CreateProduct = ({ onSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen_url: '',
        categoria: null,
        marca: null,
        colores: [],
        tallas: [],
    });

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Fetch data for select inputs
    const fetchSelectableData = async () => {
        try {
            const [colorsRes, sizesRes, brandsRes, categoriesRes] = await Promise.all([
                api.get('/colores/'),
                api.get('/tallas/'),
                api.get('/marcas/'),
                api.get('/categorias/'),
            ]);
            setColors(colorsRes.data);
            setSizes(sizesRes.data);
            setBrands(brandsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching selectable data:', error);
        }
    };

    useEffect(() => {
        fetchSelectableData();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const present_name = "clothing";
    // Función para subir la imagen a Cloudinary
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', present_name); // Reemplaza con tu upload_preset de Cloudinary
            setUploadingImage(true);

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/dxtic2eyg/image/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                const imageUrl = data.secure_url;
                setProductData((prevData) => ({
                    ...prevData,
                    imagen_url: imageUrl,
                }));
                setUploadingImage(false);
            } catch (error) {
                console.error('Error subiendo la imagen a Cloudinary:', error);
                setUploadingImage(false);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    const handleSubmit = async () => {
        const formattedData = {
            ...productData,
            categoria: productData.categoria ? parseInt(productData.categoria) : 0,
            marca: productData.marca ? parseInt(productData.marca) : 0,
            colores: productData.colores.map((color) => parseInt(color)),
            tallas: productData.tallas.map((size) => parseInt(size)),
            stock: 0,  // Enviar stock como cero por defecto
            popularidad: 0,  // Valor fijo para popularidad
        };

        try {
            await api.post('/productos/', formattedData);
            message.success('Producto creado exitosamente');
            if (onSubmit) onSubmit(formattedData);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            message.error('Error al crear el producto');
        }
    };

    return (
        <div>
            <Button type="primary" icon={<FaPlus />} onClick={showModal}>
                Agregar Producto
            </Button>

            <Modal
                title="Crear Producto"
                visible={isModalOpen}
                onCancel={handleClose}
                footer={null}
                width={800}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Input
                            name="nombre"
                            placeholder="Nombre del producto"
                            value={productData.nombre}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                            name="descripcion"
                            placeholder="Descripción del producto"
                            value={productData.descripcion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                            name="precio"
                            placeholder="Precio"
                            type="number"
                            value={productData.precio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Select
                            name="categoria"
                            value={productData.categoria}
                            onChange={(value) => handleSelectChange('categoria', value)}
                            placeholder="Selecciona una categoría"
                            style={{ width: '100%' }}
                        >
                            {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.nombre}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            name="marca"
                            value={productData.marca}
                            onChange={(value) => handleSelectChange('marca', value)}
                            placeholder="Selecciona una marca"
                            style={{ width: '100%' }}
                        >
                            {brands.map((brand) => (
                                <Option key={brand.id} value={brand.id}>
                                    {brand.nombre}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            mode="multiple"
                            name="colores"
                            value={productData.colores}
                            onChange={(value) => handleSelectChange('colores', value)}
                            placeholder="Selecciona colores"
                            style={{ width: '100%' }}
                        >
                            {colors.map((color) => (
                                <Option key={color.id} value={color.id}>
                                    {color.nombre}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            mode="multiple"
                            name="tallas"
                            value={productData.tallas}
                            onChange={(value) => handleSelectChange('tallas', value)}
                            placeholder="Selecciona tallas"
                            style={{ width: '100%' }}
                        >
                            {sizes.map((size) => (
                                <Option key={size.id} value={size.id}>
                                    {size.nombre}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <div {...getRootProps()} className="border-2 border-dashed p-4 mt-2">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Suelta la imagen aquí...</p>
                            ) : (
                                <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.</p>
                            )}
                        </div>
                        {uploadingImage && <Spin />}
                        {productData.imagen_url && (
                            <div className="mt-4">
                                <h4>Vista previa de la imagen</h4>
                                <img
                                    src={productData.imagen_url}
                                    alt="Vista previa"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="primary" onClick={handleSubmit}>Crear Producto</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CreateProduct;

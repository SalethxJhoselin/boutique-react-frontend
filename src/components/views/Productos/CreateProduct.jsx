import { Button, Input, Modal, Select, Spin, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';

const { Option } = Select;

// Datos de prueba para simular colores
const mockColors = [
    { id: 1, nombre: "Negro" },
    { id: 2, nombre: "Blanco" },
    { id: 3, nombre: "Rojo" },
    { id: 4, nombre: "Azul" },
    { id: 5, nombre: "Verde" },
    { id: 6, nombre: "Gris" }
];

// Datos de prueba para simular tallas
const mockSizes = [
    { id: 1, nombre: "XS" },
    { id: 2, nombre: "S" },
    { id: 3, nombre: "M" },
    { id: 4, nombre: "L" },
    { id: 5, nombre: "XL" },
    { id: 6, nombre: "XXL" }
];

// Datos de prueba para simular marcas
const mockBrands = [
    { id: 1, nombre: "Nike" },
    { id: 2, nombre: "Adidas" },
    { id: 3, nombre: "Puma" },
    { id: 4, nombre: "Reebok" },
    { id: 5, nombre: "Under Armour" }
];

// Datos de prueba para simular categorías
const mockCategories = [
    { id: 1, nombre: "Calzado Deportivo" },
    { id: 2, nombre: "Ropa Deportiva" },
    { id: 3, nombre: "Accesorios" },
    { id: 4, nombre: "Equipamiento" },
    { id: 5, nombre: "Suplementos" }
];

// Simulación de respuesta de Cloudinary
const mockCloudinaryResponse = {
    secure_url: "https://via.placeholder.com/400x300?text=Producto+Subido"
};

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
            // SIMULACIÓN: Reemplazar estas líneas con las peticiones reales cuando estén disponibles
            // const [colorsRes, sizesRes, brandsRes, categoriesRes] = await Promise.all([
            //     api.get('/colores/'),
            //     api.get('/tallas/'),
            //     api.get('/marcas/'),
            //     api.get('/categorias/'),
            // ]);

            // Simulación temporal
            const colorsRes = { data: mockColors };
            const sizesRes = { data: mockSizes };
            const brandsRes = { data: mockBrands };
            const categoriesRes = { data: mockCategories };

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
                // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
                // const response = await fetch('https://api.cloudinary.com/v1_1/dxtic2eyg/image/upload', {
                //     method: 'POST',
                //     body: formData,
                // });
                // const data = await response.json();

                // Simulación temporal - simular subida de imagen
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de subida
                const data = mockCloudinaryResponse;

                const imageUrl = data.secure_url;
                setProductData((prevData) => ({
                    ...prevData,
                    imagen_url: imageUrl,
                }));
                setUploadingImage(false);
                message.success('Imagen subida exitosamente');
            } catch (error) {
                console.error('Error subiendo la imagen a Cloudinary:', error);
                setUploadingImage(false);
                message.error('Error al subir la imagen');
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
            // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
            // await api.post('/productos/', formattedData);

            // Simulación temporal
            console.log('Producto creado:', formattedData);
            message.success('Producto creado exitosamente');
            if (onSubmit) onSubmit(formattedData);
            setIsModalOpen(false);

            // Limpiar formulario después de crear
            setProductData({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen_url: '',
                categoria: null,
                marca: null,
                colores: [],
                tallas: [],
            });
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
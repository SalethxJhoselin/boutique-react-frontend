import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductDetail from '../views/Catalogo/ProductDetail';
import ProductList from '../views/Catalogo/ProductList';

// Datos de prueba para simular respuestas del servicio
const mockRecommendations = {
  exactas: [
    {
      id: 1,
      nombre: "Zapatillas Running Pro",
      precio: "89.99",
      categoria: "Calzado Deportivo",
      imagen: "https://via.placeholder.com/150",
      stock: 15
    },
    {
      id: 2,
      nombre: "Camiseta Deportiva",
      precio: "29.99",
      categoria: "Ropa Deportiva",
      imagen: "https://via.placeholder.com/150",
      stock: 25
    }
  ],
  flexibles: [
    {
      id: 3,
      nombre: "Short Deportivo",
      precio: "24.99",
      categoria: "Ropa Deportiva",
      imagen: "https://via.placeholder.com/150",
      stock: 30
    }
  ],
  complementarios: [
    {
      id: 4,
      nombre: "Medias Deportivas",
      precio: "12.99",
      categoria: "Accesorios",
      imagen: "https://via.placeholder.com/150",
      stock: 50
    },
    {
      id: 5,
      nombre: "Mochila Deportiva",
      precio: "45.99",
      categoria: "Accesorios",
      imagen: "https://via.placeholder.com/150",
      stock: 10
    }
  ]
};

const mockProducts = [
  {
    id: 1,
    nombre: "Zapatillas Running Pro",
    precio: "89.99",
    descripcion: "Zapatillas profesionales para running con amortiguación avanzada",
    categoria: "Calzado Deportivo",
    marca: "SportBrand",
    colores: ["Negro", "Azul", "Rojo"],
    tallas: ["38", "39", "40", "41", "42"],
    stock: 15,
    fecha_agregado: "2024-01-15",
    imagen_url: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    nombre: "Camiseta Deportiva",
    precio: "29.99",
    descripcion: "Camiseta técnica para entrenamiento con tecnología dry-fit",
    categoria: "Ropa Deportiva",
    marca: "ActiveWear",
    colores: ["Blanco", "Negro", "Gris"],
    tallas: ["S", "M", "L", "XL"],
    stock: 25,
    fecha_agregado: "2024-01-10",
    imagen_url: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    nombre: "Short Deportivo",
    precio: "24.99",
    descripcion: "Short ligero para actividades deportivas",
    categoria: "Ropa Deportiva",
    marca: "FitGear",
    colores: ["Azul marino", "Rojo", "Verde"],
    tallas: ["S", "M", "L", "XL"],
    stock: 30,
    fecha_agregado: "2024-01-08",
    imagen_url: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    nombre: "Medias Deportivas",
    precio: "12.99",
    descripcion: "Medias técnicas con soporte para el arco plantar",
    categoria: "Accesorios",
    marca: "ComfortSock",
    colores: ["Blanco", "Negro", "Gris"],
    tallas: ["Única"],
    stock: 50,
    fecha_agregado: "2024-01-05",
    imagen_url: "https://via.placeholder.com/150"
  },
  {
    id: 5,
    nombre: "Mochila Deportiva",
    precio: "45.99",
    descripcion: "Mochila resistente al agua con compartimento para laptop",
    categoria: "Accesorios",
    marca: "OutdoorGear",
    colores: ["Negro", "Azul", "Verde"],
    tallas: ["Única"],
    stock: 10,
    fecha_agregado: "2024-01-12",
    imagen_url: "https://via.placeholder.com/150"
  }
];

const Catalog = () => {
  const { userId } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Activar estado de carga
      try {
        console.log(userId);
        let response;
        if (userId) {
          // Si el userId no es nulo, cargar las recomendaciones personalizadas
          // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
          // response = await api.post(`/recomendaciones/${userId}/`);
          response = { data: mockRecommendations }; // Simulación temporal
          console.log("Recomendaciones", response.data);

          // Combinar exactas, flexibles y complementarios
          const recommendations = [
            ...response.data.exactas,
            ...response.data.flexibles,
            ...response.data.complementarios,
          ];

          // Mapear los productos a la estructura esperada por el frontend
          setProducts(
            recommendations.map(item => ({
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen || 'https://via.placeholder.com/150', // Imagen por defecto si falta
              description: `Categoría: ${item.categoria}`,
              category: item.categoria,
              stock: item.stock,
            }))
          );
        } else {
          // Si el userId es nulo, cargar los productos del catálogo general
          // SIMULACIÓN: Reemplazar esta línea con la petición real cuando esté disponible
          // response = await api.get('/productos/');
          response = { data: mockProducts }; // Simulación temporal
          console.log("Productos", response);

          // Mapear los productos a la estructura esperada por el frontend
          setProducts(
            response.data.map(item => ({
              id: item.id,
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen_url || 'https://via.placeholder.com/150', // Imagen por defecto si falta
              description: item.descripcion,
              category: item.categoria,
              brand: item.marca,
              colors: item.colores,
              sizes: item.tallas,
              stock: item.stock,
              dateAdded: item.fecha_agregado,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // Desactivar estado de carga
      }
    };

    fetchData();
  }, [userId]); // Escuchar cambios en `userId`

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {userId ? "Recomendaciones Personalizadas" : "Catálogo de Productos"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Cargando productos...</p>
        </div>
      ) : (
        <>
          {/* Lista de productos */}
          <ProductList products={products} onSelect={setSelectedProduct} />

          {/* Detalle del producto seleccionado */}
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Catalog;
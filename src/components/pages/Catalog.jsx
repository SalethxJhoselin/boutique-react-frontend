import { useEffect, useState } from 'react';
import api from '../../api/apiServices'; // Importa la instancia configurada de Axios
import { useAuth } from '../../context/AuthContext';
import ProductDetail from '../views/Catalogo/ProductDetail';
import ProductList from '../views/Catalogo/ProductList';

// Mocks de datos para simular respuestas del backend
const mockRecommendations = {
  exactas: [
    {
      id: 1,
      nombre: "Zapatillas Running Pro",
      precio: "89.99",
      categoria: "Calzado Deportivo",
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      stock: 15,
      descripcion: "Zapatillas profesionales para running"
    },
    {
      id: 2,
      nombre: "Camiseta Deportiva",
      precio: "29.99",
      categoria: "Ropa Deportiva",
      imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      stock: 25,
      descripcion: "Camiseta técnica para entrenamiento"
    }
  ],
  flexibles: [
    {
      id: 3,
      nombre: "Short Deportivo",
      precio: "24.99",
      categoria: "Ropa Deportiva",
      imagen: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=300",
      stock: 30,
      descripcion: "Short ligero para actividades deportivas"
    },
    {
      id: 4,
      nombre: "Mochila Deportiva",
      precio: "45.50",
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      stock: 10,
      descripcion: "Mochila espaciosa para equipo deportivo"
    }
  ],
  complementarios: [
    {
      id: 5,
      nombre: "Botella Deportiva",
      precio: "12.99",
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300",
      stock: 50,
      descripcion: "Botella de agua para deportistas"
    },
    {
      id: 6,
      nombre: "Toalla Deportiva",
      precio: "18.75",
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=300",
      stock: 20,
      descripcion: "Toalla absorbente para entrenamiento"
    }
  ]
};

const mockGeneralProducts = [
  {
    id: 101,
    nombre: "Zapatillas Urbanas",
    precio: "75.00",
    descripcion: "Zapatillas cómodas para uso diario con suela antideslizante",
    categoria: "Calzado Casual",
    marca: "UrbanSteps",
    colores: ["Negro", "Blanco", "Azul"],
    tallas: ["38", "39", "40", "41", "42"],
    stock: 45,
    imagen_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300",
    fecha_agregado: "2024-01-15"
  },
  {
    id: 102,
    nombre: "Sudadera con Capucha",
    precio: "49.99",
    descripcion: "Sudadera abrigada para clima frío, material transpirable",
    categoria: "Ropa Casual",
    marca: "ComfortWear",
    colores: ["Gris", "Negro", "Azul Marino"],
    tallas: ["S", "M", "L", "XL"],
    stock: 35,
    imagen_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    fecha_agregado: "2024-01-10"
  },
  {
    id: 103,
    nombre: "Gorra Deportiva",
    precio: "19.99",
    descripcion: "Gorra ajustable para protección solar con tecnología UV",
    categoria: "Accesorios",
    marca: "SportCap",
    colores: ["Negro", "Blanco", "Rojo", "Azul"],
    tallas: ["Única"],
    stock: 60,
    imagen_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300",
    fecha_agregado: "2024-01-20"
  },
  {
    id: 104,
    nombre: "Pantalones Deportivos",
    precio: "39.99",
    descripcion: "Pantalones cómodos para entrenamiento con tejido elástico",
    categoria: "Ropa Deportiva",
    marca: "FitGear",
    colores: ["Negro", "Gris", "Verde"],
    tallas: ["S", "M", "L", "XL"],
    stock: 28,
    imagen_url: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=300",
    fecha_agregado: "2024-01-18"
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
          try {
            response = await api.post(`/recomendaciones/${userId}/`);
            console.log("Recomendaciones", response.data);
          } catch (error) {
            console.warn("Error en API de recomendaciones, usando mock data:", error);
            // Simular respuesta de API con mock data
            response = { data: mockRecommendations };
          }

          // Combinar exactas, flexibles y complementarios
          const recommendations = [
            ...response.data.exactas,
            ...response.data.flexibles,
            ...response.data.complementarios,
          ];

          // Mapear los productos a la estructura esperada por el frontend
          setProducts(
            recommendations.map(item => ({
              id: item.id,
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
          try {
            response = await api.get('/productos/');
            console.log("Productos", response);
          } catch (error) {
            console.warn("Error en API de productos, usando mock data:", error);
            // Simular respuesta de API con mock data
            response = { data: mockGeneralProducts };
          }

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
        // Fallback a mock data en caso de error general
        const fallbackData = userId ? mockRecommendations : mockGeneralProducts;

        if (userId) {
          const recommendations = [
            ...fallbackData.exactas,
            ...fallbackData.flexibles,
            ...fallbackData.complementarios,
          ];
          setProducts(
            recommendations.map(item => ({
              id: item.id,
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen || 'https://via.placeholder.com/150',
              description: `Categoría: ${item.categoria}`,
              category: item.categoria,
              stock: item.stock,
            }))
          );
        } else {
          setProducts(
            fallbackData.map(item => ({
              id: item.id,
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen_url || 'https://via.placeholder.com/150',
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
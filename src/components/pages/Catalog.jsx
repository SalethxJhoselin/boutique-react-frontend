import { useEffect, useState } from 'react';
import api from '../../api/apiServices'; // Importa la instancia configurada de Axios
import { useAuth } from '../../context/AuthContext';
import ProductDetail from '../views/Catalogo/ProductDetail';
import ProductList from '../views/Catalogo/ProductList';

// Mocks de datos para desarrollo
const MOCK_RECOMMENDATIONS = {
  exactas: [
    {
      id: 1,
      nombre: "Zapatillas Running Pro",
      precio: "89.99",
      categoria: "Calzado Deportivo",
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      stock: 15,
      descripcion: "Zapatillas profesionales para running"
    },
    {
      id: 2,
      nombre: "Camiseta Deportiva",
      precio: "29.99",
      categoria: "Ropa Deportiva",
      imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
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
      imagen: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
      stock: 30,
      descripcion: "Short ligero para actividades deportivas"
    },
    {
      id: 4,
      nombre: "Mochila Deportiva",
      precio: "45.50",
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
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
      imagen: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
      stock: 50,
      descripcion: "Botella de agua para deportistas"
    },
    {
      id: 6,
      nombre: "Toalla Deportiva",
      precio: "18.75",
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1584824486509-112e4181c5db?w=400",
      stock: 20,
      descripcion: "Toalla absorbente para entrenamiento"
    }
  ]
};

const MOCK_PRODUCTS = [
  {
    id: 101,
    nombre: "Zapatillas Urbanas",
    precio: "75.00",
    descripcion: "Zapatillas cómodas para uso diario con diseño moderno y materiales de calidad",
    categoria: "Calzado Casual",
    marca: "UrbanSteps",
    colores: ["Negro", "Blanco", "Azul"],
    tallas: ["38", "39", "40", "41", "42"],
    stock: 45,
    imagen_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    fecha_agregado: "2024-01-15"
  },
  {
    id: 102,
    nombre: "Sudadera con Capucha",
    precio: "49.99",
    descripcion: "Sudadera abrigada para clima frío, perfecta para días frescos",
    categoria: "Ropa Casual",
    marca: "ComfortWear",
    colores: ["Gris", "Negro", "Azul Marino"],
    tallas: ["S", "M", "L", "XL"],
    stock: 35,
    imagen_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    fecha_agregado: "2024-01-10"
  },
  {
    id: 103,
    nombre: "Gorra Deportiva",
    precio: "19.99",
    descripcion: "Gorra ajustable para protección solar durante actividades al aire libre",
    categoria: "Accesorios",
    marca: "SportCap",
    colores: ["Negro", "Blanco", "Rojo", "Azul"],
    tallas: ["Única"],
    stock: 60,
    imagen_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
    fecha_agregado: "2024-01-20"
  },
  {
    id: 104,
    nombre: "Pantalones Deportivos",
    precio: "39.99",
    descripcion: "Pantalones cómodos para entrenamiento con tecnología de secado rápido",
    categoria: "Ropa Deportiva",
    marca: "FitGear",
    colores: ["Negro", "Gris", "Verde"],
    tallas: ["S", "M", "L", "XL"],
    stock: 28,
    imagen_url: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=400",
    fecha_agregado: "2024-01-18"
  },
  {
    id: 105,
    nombre: "Reloj Deportivo",
    precio: "199.99",
    descripcion: "Reloj inteligente con monitor de actividad y ritmo cardíaco",
    categoria: "Electrónicos",
    marca: "TechFit",
    colores: ["Negro", "Plateado", "Azul"],
    tallas: ["Única"],
    stock: 12,
    imagen_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    fecha_agregado: "2024-01-22"
  }
];

const Catalog = () => {
  const { userId } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false); // Control para usar mocks

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('User ID:', userId);
        let response;

        if (useMockData) {
          // Usar datos mock para desarrollo
          console.log("Usando datos mock");
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

          if (userId) {
            // Mock para recomendaciones personalizadas
            const recommendations = [
              ...MOCK_RECOMMENDATIONS.exactas,
              ...MOCK_RECOMMENDATIONS.flexibles,
              ...MOCK_RECOMMENDATIONS.complementarios,
            ];

            setProducts(
              recommendations.map(item => ({
                id: item.id,
                name: item.nombre,
                price: parseFloat(item.precio),
                originalPrice: parseFloat(item.precio),
                image: item.imagen || 'https://via.placeholder.com/150',
                description: item.descripcion,
                category: item.categoria,
                stock: item.stock,
              }))
            );
          } else {
            // Mock para catálogo general
            setProducts(
              MOCK_PRODUCTS.map(item => ({
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
        } else {
          // Usar API real
          if (userId) {
            response = await api.post(`/recomendaciones/${userId}/`);
            console.log("Recomendaciones reales", response.data);

            const recommendations = [
              ...response.data.exactas,
              ...response.data.flexibles,
              ...response.data.complementarios,
            ];

            setProducts(
              recommendations.map(item => ({
                id: item.id,
                name: item.nombre,
                price: parseFloat(item.precio),
                originalPrice: parseFloat(item.precio),
                image: item.imagen || 'https://via.placeholder.com/150',
                description: item.descripcion || `Categoría: ${item.categoria}`,
                category: item.categoria,
                stock: item.stock,
              }))
            );
          } else {
            response = await api.get('/productos/');
            console.log("Productos reales", response.data);

            setProducts(
              response.data.map(item => ({
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
        }
      } catch (error) {
        console.error("Error fetching data", error);
        // En caso de error, usar datos mock automáticamente
        console.log("Error en API, usando datos mock...");
        setUseMockData(true);
        // Re-ejecutar el efecto con datos mock
        const fetchDataWithMock = async () => {
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 500));

          if (userId) {
            const recommendations = [
              ...MOCK_RECOMMENDATIONS.exactas,
              ...MOCK_RECOMMENDATIONS.flexibles,
              ...MOCK_RECOMMENDATIONS.complementarios,
            ];
            setProducts(recommendations.map(item => ({
              id: item.id,
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen,
              description: item.descripcion,
              category: item.categoria,
              stock: item.stock,
            })));
          } else {
            setProducts(MOCK_PRODUCTS.map(item => ({
              id: item.id,
              name: item.nombre,
              price: parseFloat(item.precio),
              originalPrice: parseFloat(item.precio),
              image: item.imagen_url,
              description: item.descripcion,
              category: item.categoria,
              brand: item.marca,
              colors: item.colores,
              sizes: item.tallas,
              stock: item.stock,
              dateAdded: item.fecha_agregado,
            })));
          }
          setLoading(false);
        };
        fetchDataWithMock();
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, useMockData]);

  return (
    <div className="container mx-auto p-4">
      {/* Switch para usar mocks (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Usar datos de prueba (mocks)</span>
          </label>
          {useMockData && (
            <p className="text-xs text-yellow-700 mt-1">
              Modo desarrollo: Mostrando datos mockeados
            </p>
          )}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">
        {userId ? "Recomendaciones Personalizadas" : "Catálogo de Productos"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Indicador de datos mock en desarrollo */}
          {useMockData && process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mb-4">
              <strong>Modo Desarrollo:</strong> Mostrando {products.length} productos de prueba
            </div>
          )}

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
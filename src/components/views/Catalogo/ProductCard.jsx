import { useState } from 'react';
import api from '../../../api/apiServices';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

// Mocks de datos para desarrollo
const MOCK_SEARCH_RESPONSE = {
  id: Math.floor(Math.random() * 1000) + 1000,
  usuario: 1,
  producto: null,
  fecha_busqueda: new Date().toISOString(),
  tipo: "vista_detalle"
};

const MOCK_ERROR_RESPONSES = {
  search_error: {
    detail: "Error al registrar búsqueda",
    message: "No se pudo registrar la acción de visualización"
  },
  auth_error: {
    detail: "Usuario no autenticado",
    message: "Se requiere autenticación para registrar búsquedas"
  }
};

// Producto mock extendido para pruebas
const MOCK_PRODUCT_EXTENDED = {
  id: 1,
  name: "Zapatillas Running Pro",
  price: 89.99,
  originalPrice: 99.99,
  discount: "10% OFF",
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  description: "Zapatillas profesionales para running con tecnología de amortiguación avanzada",
  category: "Calzado Deportivo",
  brand: "SportMax",
  color: "Negro/Rojo",
  size: "42",
  inventory: 15,
  features: ["Amortiguación Air", "Suela antideslizante", "Material transpirable"],
  rating: 4.5,
  reviews: 128,
  shipping: "Envío gratis",
  tags: ["running", "deporte", "zapatillas"]
};

const ProductCard = ({ product, onSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { addToCart } = useCart();
  const { userId } = useAuth();

  // Producto actual (real o mock)
  const currentProduct = useMockData ? { ...MOCK_PRODUCT_EXTENDED, ...product } : product;

  // Simular registro de búsqueda
  const mockRegisterSearch = async (productId, shouldError = false) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (shouldError) {
      throw {
        response: {
          data: MOCK_ERROR_RESPONSES.search_error
        }
      };
    }

    return {
      data: {
        ...MOCK_SEARCH_RESPONSE,
        producto: productId,
        usuario: userId || 1
      }
    };
  };

  // Función para manejar el cambio en el input, asegurando solo números
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) > 0) {
      setQuantity(Math.min(Number(value), currentProduct.inventory || 10));
    }
  };

  // Función para incrementar cantidad
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, currentProduct.inventory || 10));
  };

  // Función para decrementar cantidad
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Función para registrar la búsqueda
  const registerSearch = async (productId) => {
    if (!userId && !useMockData) {
      console.warn("El usuario no está autenticado, no se registrará la búsqueda.");
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (useMockData) {
        console.log("Registrando búsqueda con mock");
        response = await mockRegisterSearch(productId);
      } else if (userId) {
        response = await api.post('/busquedas/', { usuario: userId, producto: productId });
      }

      console.log("Búsqueda registrada exitosamente:", response?.data);
    } catch (error) {
      console.error("Error al registrar la búsqueda:", error);

      // Solo mostrar error si no es por falta de autenticación
      if (error.response?.data?.detail !== "Usuario no autenticado") {
        console.warn("Error no crítico en registro de búsqueda:", error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    registerSearch(currentProduct.id);
    onSelect(currentProduct);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...currentProduct,
      quantity: Number(quantity)
    };

    addToCart(productToAdd, Number(quantity));

    console.log(`Producto agregado al carrito:`, {
      nombre: currentProduct.name,
      cantidad: quantity,
      precio: currentProduct.price,
      subtotal: (currentProduct.price * quantity).toFixed(2)
    });

    // Feedback visual
    if (useMockData) {
      console.log("MODO PRUEBA: Producto agregado al carrito mock");
    }
  };

  // Probar diferentes escenarios
  const testScenario = (scenario) => {
    setUseMockData(true);
    switch (scenario) {
      case 'low_stock':
        setQuantity(1);
        break;
      case 'max_quantity':
        setQuantity(currentProduct.inventory || 10);
        break;
      case 'normal':
        setQuantity(2);
        break;
      default:
        setQuantity(1);
    }
  };

  const isOutOfStock = (currentProduct.inventory || 0) === 0;
  const hasDiscount = currentProduct.price < currentProduct.originalPrice;
  const discountAmount = hasDiscount
    ? currentProduct.originalPrice - currentProduct.price
    : 0;
  const discountPercentage = hasDiscount
    ? Math.round((discountAmount / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md p-4 hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Panel de control para desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-3 p-2 bg-gray-100 border border-gray-300 rounded text-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                className="rounded"
                size="small"
              />
              <span className="font-medium">Modo Prueba</span>
            </label>
            {useMockData && (
              <span className="px-1 py-0.5 bg-yellow-500 text-white text-xs rounded">
                MOCK
              </span>
            )}
          </div>

          {useMockData && (
            <div className="flex flex-wrap gap-1 mt-1">
              <button
                type="button"
                onClick={() => testScenario('low_stock')}
                className="px-1 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Poca Cantidad
              </button>
              <button
                type="button"
                onClick={() => testScenario('max_quantity')}
                className="px-1 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Máxima Cantidad
              </button>
              <button
                type="button"
                onClick={() => testScenario('normal')}
                className="px-1 py-0.5 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Cantidad Normal
              </button>
            </div>
          )}
        </div>
      )}

      {useMockData && process.env.NODE_ENV === 'development' && (
        <div className="mb-2 p-2 bg-blue-100 border border-blue-400 text-blue-700 rounded text-xs">
          <strong>Modo Prueba:</strong> Producto mock cargado
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative">
        <img
          src={currentProduct.image}
          alt={currentProduct.name}
          className="w-full h-48 object-cover mb-4 rounded-lg"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-sm font-bold">
            AGOTADO
          </div>
        )}
      </div>

      {/* Información del producto */}
      <h3 className="text-xl font-semibold mb-2 h-12 overflow-hidden">{currentProduct.name}</h3>

      {/* Precios */}
      <div className="mb-2">
        {hasDiscount ? (
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">
              ${currentProduct.price.toFixed(2)}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ${currentProduct.originalPrice.toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-800">
            ${currentProduct.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Badge de descuento */}
      {currentProduct.discount && (
        <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium mb-2">
          {currentProduct.discount}
        </span>
      )}

      {/* Especificaciones */}
      <div className="space-y-1 mb-3 text-sm text-gray-600">
        {currentProduct.category && (
          <p><strong>Categoría:</strong> {currentProduct.category}</p>
        )}
        {currentProduct.brand && (
          <p><strong>Marca:</strong> {currentProduct.brand}</p>
        )}
        {currentProduct.color && (
          <p><strong>Color:</strong> {currentProduct.color}</p>
        )}
        {currentProduct.size && (
          <p><strong>Talla:</strong> {currentProduct.size}</p>
        )}
      </div>

      {/* Stock */}
      <div className="mb-3">
        {!isOutOfStock ? (
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-medium">
              ✅ En stock: {currentProduct.inventory}
            </span>
            {currentProduct.inventory <= 5 && currentProduct.inventory > 0 && (
              <span className="text-orange-500 text-sm">¡Últimas unidades!</span>
            )}
          </div>
        ) : (
          <p className="text-red-500 font-medium">❌ Agotado</p>
        )}
      </div>

      {/* Rating (solo en mocks) */}
      {useMockData && currentProduct.rating && (
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(currentProduct.rating))}
            {"☆".repeat(5 - Math.floor(currentProduct.rating))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({currentProduct.rating}) • {currentProduct.reviews} reviews
          </span>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex space-x-2 mb-3">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleViewDetails}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            'Ver Detalles'
          )}
        </button>
      </div>

      {/* Selector de cantidad y botón comprar */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center border rounded">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={currentProduct.inventory || 10}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 p-1 text-center border-0 focus:ring-0"
            disabled={isOutOfStock}
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= (currentProduct.inventory || 10) || isOutOfStock}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300"
          >
            +
          </button>
        </div>

        <button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
        >
          {isOutOfStock ? 'Agotado' : `Agregar $${(currentProduct.price * quantity).toFixed(2)}`}
        </button>
      </div>

      {/* Información adicional en desarrollo */}
      {process.env.NODE_ENV === 'development' && useMockData && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <p><strong>Debug Info:</strong></p>
          <p>ID: {currentProduct.id} | Stock: {currentProduct.inventory}</p>
          <p>Usuario: {userId || 'No autenticado'}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
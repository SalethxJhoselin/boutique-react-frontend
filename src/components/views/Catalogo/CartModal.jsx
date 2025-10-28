import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/apiServices';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

// Mocks de datos para desarrollo
const MOCK_PURCHASE_RESPONSE = {
    id: Math.floor(Math.random() * 1000) + 1000,
    numero_venta: `NV-${Date.now()}`,
    fecha_emision: new Date().toISOString(),
    observacion: "Compra a través de Stripe",
    total: 0,
    usuario: 1,
    detalles: [],
    estado: "pendiente"
};

const MOCK_ERROR_RESPONSES = {
    empty_cart: {
        detail: "El carrito está vacío",
        message: "No se puede realizar la compra con el carrito vacío"
    },
    server_error: {
        detail: "Error del servidor",
        message: "No se pudo procesar la compra en este momento"
    },
    payment_error: {
        detail: "Error de pago",
        message: "No se pudo iniciar el proceso de pago"
    }
};

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Zapatillas Running Pro",
        price: 89.99,
        originalPrice: 99.99,
        discount: "10%",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150",
        quantity: 2,
        category: "Calzado Deportivo"
    },
    {
        id: 2,
        name: "Camiseta Deportiva",
        price: 29.99,
        originalPrice: 34.99,
        discount: "14%",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150",
        quantity: 1,
        category: "Ropa Deportiva"
    },
    {
        id: 3,
        name: "Short Deportivo",
        price: 24.99,
        originalPrice: 24.99,
        discount: null,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=150",
        quantity: 3,
        category: "Ropa Deportiva"
    }
];

const CartModal = ({ onClose }) => {
    const { cart, clearCart } = useCart();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);
    const [mockCart, setMockCart] = useState([]);

    // Simular compra con mock
    const mockPurchase = async (purchaseData, shouldError = false, errorType = 'server_error') => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (shouldError) {
            throw {
                response: {
                    data: MOCK_ERROR_RESPONSES[errorType] || MOCK_ERROR_RESPONSES.server_error
                }
            };
        }

        const total = mockCart.reduce((sum, product) => sum + product.price * product.quantity, 0);

        return {
            data: {
                ...MOCK_PURCHASE_RESPONSE,
                total: total,
                detalles: mockCart.map(product => ({
                    producto: product.id,
                    cantidad: product.quantity,
                    precio_unitario: product.price,
                    subtotal: product.price * product.quantity
                }))
            }
        };
    };

    const handlePurchase = async () => {
        const currentCart = useMockData ? mockCart : cart;

        if (currentCart.length === 0) {
            console.warn("El carrito está vacío. No se puede realizar la compra.");
            alert("El carrito está vacío. Agrega productos antes de comprar.");
            return;
        }

        setIsLoading(true);

        const subtotal = currentCart.reduce((total, product) => total + product.price * product.quantity, 0);

        // Prepara los datos para enviar al backend
        const purchaseData = {
            observacion: "Compra a través de Stripe",
            detalles: currentCart.map(product => ({
                producto: product.id,
                cantidad: product.quantity,
            })),
        };

        try {
            let response;

            if (useMockData) {
                console.log("Realizando compra con mock");
                response = await mockPurchase(purchaseData);
            } else {
                response = await api.post('/notas-venta/', purchaseData);
            }

            console.log("Nota de venta registrada exitosamente:", response.data);

            // Generar el PDF con los detalles de la nota de venta
            generatePDF(response.data, currentCart);

            // Simular redirección a Stripe (en mocks mostramos mensaje)
            if (useMockData) {
                alert("MODO PRUEBA: Redirigiendo a Stripe... (En producción esto abriría stripe.com)");
            } else {
                const stripeURL = "https://buy.stripe.com/test_9AQbKF5h9gaO1Qk5ko";
                window.open(stripeURL, '_blank');
            }

            // Redirige a una página de recibo de compra
            navigate('/purchase-receipt');

            // Limpia el carrito después de la compra
            if (useMockData) {
                setMockCart([]);
            } else {
                clearCart();
            }

        } catch (error) {
            console.error("Error al registrar la nota de venta:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.detail ||
                "Error al procesar la compra";
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = (saleData, products) => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(18);
        doc.text('Nota de Venta', 105, 15, { align: 'center' });

        // Información de la venta
        doc.setFontSize(12);
        doc.text(`Número de Venta: ${saleData.numero_venta || 'NV-' + Date.now()}`, 10, 30);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 40);
        doc.text(`Usuario ID: ${userId || 'Demo'}`, 10, 50);
        doc.text(`Observación: ${saleData.observacion}`, 10, 60);

        // Tabla con detalles de los productos
        const tableColumn = ['Producto', 'Cantidad', 'Precio Unitario ($)', 'Subtotal ($)'];
        const tableRows = products.map(product => [
            product.name,
            product.quantity,
            product.price.toFixed(2),
            (product.price * product.quantity).toFixed(2),
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [66, 139, 202] }
        });

        // Total general
        const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        const finalY = doc.previousAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: $${total.toFixed(2)}`, 10, finalY);

        // Guardar el archivo
        doc.save(`nota_venta_${saleData.numero_venta || Date.now()}.pdf`);
    };

    const loadMockCart = () => {
        setMockCart([...MOCK_PRODUCTS]);
        setUseMockData(true);
    };

    const clearMockCart = () => {
        setMockCart([]);
    };

    const addMockProduct = () => {
        const newProduct = {
            ...MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)],
            id: Date.now(),
            quantity: Math.floor(Math.random() * 3) + 1
        };
        setMockCart(prev => [...prev, newProduct]);
    };

    const currentCart = useMockData ? mockCart : cart;
    const total = currentCart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const totalItems = currentCart.reduce((sum, product) => sum + product.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-90vh overflow-y-auto relative">
                <button
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    ×
                </button>

                {/* Panel de control para desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={useMockData}
                                    onChange={(e) => setUseMockData(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium">Usar datos de prueba</span>
                            </label>
                            {useMockData && (
                                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                                    MOCK
                                </span>
                            )}
                        </div>

                        {useMockData && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-600 mb-1">Gestionar carrito mock:</p>
                                <div className="flex flex-wrap gap-1">
                                    <button
                                        type="button"
                                        onClick={loadMockCart}
                                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                        Cargar Carrito
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addMockProduct}
                                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                    >
                                        Agregar Producto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearMockCart}
                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                    >
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {useMockData && process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                        <strong>Modo Prueba:</strong> Carrito mock con {mockCart.length} productos
                    </div>
                )}

                <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>

                {currentCart.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
                        {process.env.NODE_ENV === 'development' && !useMockData && (
                            <button
                                onClick={() => setUseMockData(true)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Probar con datos de prueba
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        {/* Resumen del carrito */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total de productos: {totalItems}</span>
                                <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Lista de productos */}
                        {currentCart.map(product => (
                            <div key={product.id} className="border-b py-4 flex items-start space-x-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">Cantidad: {product.quantity}</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold">Precio: ${product.price.toFixed(2)}</p>
                                        {product.discount && (
                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                                Descuento: {product.discount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-medium text-green-600">
                                        Subtotal: ${(product.price * product.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Botón de Comprar */}
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {useMockData && "MODO PRUEBA - "}
                                {currentCart.length} productos en el carrito
                            </div>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                                onClick={handlePurchase}
                                disabled={isLoading || currentCart.length === 0}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <span>Comprar - ${total.toFixed(2)}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Información de mocks en desarrollo */}
                {process.env.NODE_ENV === 'development' && useMockData && (
                    <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                        <p className="font-semibold mb-2">Productos mock disponibles:</p>
                        <ul className="space-y-1">
                            {MOCK_PRODUCTS.map(product => (
                                <li key={product.id}>
                                    <strong>{product.name}:</strong> ${product.price} - {product.discount || 'Sin descuento'}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
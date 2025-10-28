import jsPDF from 'jspdf'; // Importa la librería para generar PDFs
import 'jspdf-autotable'; // Plugin para tablas en jsPDF
import { useNavigate } from 'react-router-dom';
import api from '../../../api/apiServices'; // Asegúrate de importar tu instancia de Axios
import { useAuth } from '../../../context/AuthContext'; // Para obtener el userId
import { useCart } from '../../../context/CartContext';

const CartModal = ({ onClose }) => {
    const { cart, clearCart } = useCart(); // Accede a los productos en el carrito
    const { userId } = useAuth(); // Obtener el userId del contexto de autenticación
    const navigate = useNavigate();

    const handlePurchase = async () => {
        if (cart.length === 0) {
            console.warn("El carrito está vacío. No se puede realizar la compra.");
            return;
        }

        const subtotal = cart.reduce((total, product) => total + product.price * product.quantity, 0);

        // Prepara los datos para enviar al backend
        const purchaseData = {
            observacion: "Compra a través de Stripe",
            detalles: cart.map(product => ({
                producto: product.id,
                cantidad: product.quantity,
            })),
        };

        try {
            // Enviar la solicitud al backend
            const response = await api.post('/notas-venta/', purchaseData);
            console.log("Nota de venta registrada exitosamente:", response.data);

            // Generar el PDF con los detalles de la nota de venta
            generatePDF(purchaseData);

            // Redirigir al usuario a Stripe para completar el pago
            const stripeURL = "https://buy.stripe.com/test_9AQbKF5h9gaO1Qk5ko";
            window.open(stripeURL, '_blank');

            // Redirige a una página de recibo de compra
            navigate('/purchase-receipt');

            // Limpia el carrito después de la compra
            clearCart();
        } catch (error) {
            console.error("Error al registrar la nota de venta:", error);
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(18);
        doc.text('Nota de Venta', 105, 15, { align: 'center' });

        // Información del usuario
        doc.setFontSize(12);
        doc.text(`Usuario ID: ${userId}`, 10, 30);
        doc.text(`Observación: ${data.observacion}`, 10, 40);

        // Tabla con detalles de los productos
        const tableColumn = ['Producto ID', 'Nombre', 'Cantidad', 'Precio Unitario ($)', 'Subtotal ($)'];
        const tableRows = cart.map(product => [
            product.id,
            product.name,
            product.quantity,
            product.price.toFixed(2),
            (product.price * product.quantity).toFixed(2),
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        // Total general
        const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
        doc.text(`Total: $${total.toFixed(2)}`, 10, doc.previousAutoTable.finalY + 10);

        // Guardar el archivo
        doc.save('nota_de_venta.pdf');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/2 relative">
                <button className="absolute top-2 right-2" onClick={onClose}>
                    X
                </button>
                <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>

                {cart.length === 0 ? (
                    <p className="text-center">Tu carrito está vacío.</p>
                ) : (
                    <div>
                        {/* Mapeamos los productos en el carrito */}
                        {cart.map(product => (
                            <div key={product.id} className="border-b py-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p>Cantidad: {product.quantity}</p>
                                    <p>Precio (con descuento): ${product.price.toFixed(2)}</p>
                                    {product.discount && (
                                        <p className="text-red-500">
                                            Descuento: {product.discount}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Botón de Comprar al final de la lista */}
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={handlePurchase}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;

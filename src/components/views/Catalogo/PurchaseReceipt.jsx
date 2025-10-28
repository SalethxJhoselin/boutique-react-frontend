import React, { useEffect }from 'react';
import { useCart } from '../../../context/CartContext';

const PurchaseReceipt = () => {
    const { cart } = useCart(); // Puedes guardar el carrito en un estado temporal antes de limpiarlo

    // Calcular el subtotal
    const subtotal = cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    /* me esta limpiando antes de generar la nota de compra
    useEffect(() => {
        // Limpiar el carrito después de mostrar la nota de compra
        clearCart();
    }, []); // El efecto se ejecuta una vez después del primer renderizado
*/
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Nota de Compra</h2>

            {/* Mapeamos los productos comprados */}
            {cart.map(product => (
                <div key={product.id} className="border-b py-4 flex items-center space-x-4">
                    {/* Imagen del producto */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    {/* Detalles del producto */}
                    <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p>Cantidad: {product.quantity}</p>
                        <p>Precio Final (con descuento): ${product.price.toFixed(2)}</p>
                        {product.discount && (
                            <p className="text-red-500">
                                Descuento aplicado: {product.discount}
                            </p>
                        )}
                    </div>
                </div>
            ))}

            {/* Subtotal */}
            <div className="mt-6 text-right">
                <h3 className="text-2xl font-semibold">Subtotal: ${subtotal.toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default PurchaseReceipt;

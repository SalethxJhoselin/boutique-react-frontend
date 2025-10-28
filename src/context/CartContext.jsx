import React, { createContext, useState, useContext } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Función para agregar un producto al carrito
    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);

            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                // Si es un producto nuevo, agregarlo al carrito
                return [...prevCart, { ...product, quantity }];
            }
        });
    };
    // Función para calcular el total de productos en el carrito
    const getTotalItems = () => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    };
    const clearCart = () => {
        setCart([]); // Limpia el carrito
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, getTotalItems,clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);

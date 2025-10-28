import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import CartModal from './CartModal';
import { FaShoppingCart  } from 'react-icons/fa';

const CartSummary = () => {
  const { getTotalItems } = useCart();
  const [isModalOpen, setModalOpen] = useState(false);

  // Función para abrir y cerrar el modal
  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <div>
      <p onClick={toggleModal} className="cursor-pointer">
        <FaShoppingCart />{getTotalItems()}
      </p>

      {/* Modal para mostrar el carrito */}
      {isModalOpen && <CartModal onClose={toggleModal} />}
    </div>
  );
};

export default CartSummary;

import React from 'react';

const ProductDetail = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>X</button>

        {/* Imagen del producto */}
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />

        {/* Nombre del producto */}
        <h3 className="text-2xl font-semibold">{product.name}</h3>

        {/* Precio y descuento */}
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        {product.discount && <p className="text-red-500">{product.discount}</p>}

        {/* Descripción detallada del producto */}
        <p className="mt-4">{product.description}</p>

        {/* Nueva información: categoría, talla, marca, color, inventario */}
        <p className="text-gray-500">Categoría: {product.category}</p>
        <p className="text-gray-500">Talla: {product.size}</p>
        <p className="text-gray-500">Marca: {product.brand}</p>
        <p className="text-gray-500">Color: {product.color}</p>
        <p className="text-gray-500">
          {product.inventory > 0 ? `En stock: ${product.inventory}` : 'Agotado'}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;

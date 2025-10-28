import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ProductList;

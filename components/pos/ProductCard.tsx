import React from 'react';
import { Producto } from '../../types';

interface ProductCardProps {
    product: Producto;
    onAddToCart: (product: Producto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <button
            onClick={() => onAddToCart(product)}
            className="group relative flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg hover:border-indigo-500 transition-all duration-200"
        >
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden mb-2">
                <img 
                    src={product.imagenUrl} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                {product.nombre}
            </h3>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                ${product.precio.toFixed(2)}
            </p>
        </button>
    );
};

export default ProductCard;

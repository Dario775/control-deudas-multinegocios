import React, { useState, useEffect } from 'react';
import { Producto } from '../../types';
import { XIcon, DollarSignIcon, BarcodeIcon, PackageIcon } from '../icons';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Producto) => void;
    productToEdit: Producto | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
    const getInitialState = (): Omit<Producto, 'id'> => ({
        nombre: '',
        sku: '',
        precio: 0,
        stock: 0,
        categoria: '',
        imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=Producto'
    });
    
    const [product, setProduct] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setProduct(productToEdit || getInitialState());
        }
    }, [isOpen, productToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: name === 'precio' || name === 'stock' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProduct: Producto = {
            ...product,
            id: productToEdit?.id || `prod-${Date.now()}`,
        };
        onSave(finalProduct);
    };

    const inputStyle = "block w-full py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border dark:border-gray-700" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button type="button" onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium mb-1.5">Nombre del Producto</label>
                            <input type="text" name="nombre" value={product.nombre} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium mb-1.5">SKU</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BarcodeIcon className="w-5 h-5 text-gray-400"/></div>
                                    <input type="text" name="sku" value={product.sku} onChange={handleChange} className={`${inputStyle} pl-10`} required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="precio" className="block text-sm font-medium mb-1.5">Precio</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSignIcon className="w-5 h-5 text-gray-400"/></div>
                                    <input type="number" name="precio" value={product.precio} onChange={handleChange} min="0" step="0.01" className={`${inputStyle} pl-10`} required />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium mb-1.5">Stock</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PackageIcon className="w-5 h-5 text-gray-400"/></div>
                                <input type="number" name="stock" value={product.stock} onChange={handleChange} min="0" className={`${inputStyle} pl-10`} required />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Guardar Producto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;

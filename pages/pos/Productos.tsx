import React, { useState, useMemo } from 'react';
import { Producto } from '../../types';
import { mockProductos } from '../../data/mockData';
import { SearchIcon, PlusIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from '../../components/icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProductModal from '../../components/modals/ProductModal';

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>(mockProductos);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Producto | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Producto | null>(null);

    const filteredProductos = useMemo(() => {
        return productos.filter(p =>
            p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [productos, searchQuery]);

    const handleOpenModal = (producto?: Producto) => {
        setProductToEdit(producto || null);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSaveProduct = (productData: Producto) => {
        setProductos(prev => {
            const exists = prev.some(p => p.id === productData.id);
            if (exists) {
                return prev.map(p => (p.id === productData.id ? productData : p));
            }
            return [productData, ...prev];
        });
        setIsModalOpen(false);
    };
    
    const handleDelete = (producto: Producto) => {
        setProductToDelete(producto);
        setIsConfirmOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            setProductos(prev => prev.filter(p => p.id !== productToDelete.id));
        }
        setIsConfirmOpen(false);
        setProductToDelete(null);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Productos</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Administra tu catálogo e inventario.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Producto</th>
                            <th scope="col" className="px-6 py-3">SKU</th>
                            <th scope="col" className="px-6 py-3">Precio</th>
                            <th scope="col" className="px-6 py-3">Stock</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map((producto) => (
                            <tr key={producto.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center space-x-3">
                                    <img src={producto.imagenUrl} alt={producto.nombre} className="w-10 h-10 rounded-md object-cover"/>
                                    <span>{producto.nombre}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{producto.sku}</td>
                                <td className="px-6 py-4 font-semibold">${producto.precio.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={producto.stock < 10 ? 'text-red-500 font-bold' : ''}>
                                        {producto.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(producto.id === openMenuId ? null : producto.id)}} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <MoreVerticalIcon className="w-5 h-5" />
                                    </button>
                                    {openMenuId === producto.id && (
                                        <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                                            <button onClick={() => handleOpenModal(producto)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <PencilIcon className="w-4 h-4 mr-2" /> Editar
                                            </button>
                                            <button onClick={() => handleDelete(producto)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Trash2Icon className="w-4 h-4 mr-2" /> Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={`Eliminar Producto "${productToDelete?.nombre ?? ''}"`}
                message="¿Estás seguro de que quieres eliminar este producto? Esta acción es permanente."
            />
        </div>
    );
};

export default Productos;
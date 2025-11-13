import React from 'react';
import { mockProductos } from '../../data/mockData';
import { SearchIcon, AlertCircleIcon } from '../../components/icons';

const POSStock: React.FC = () => {
    const lowStockThreshold = 10;
    
    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Control de Stock</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Visualiza los niveles de inventario de tus productos.</p>
                </div>
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Producto</th>
                            <th scope="col" className="px-6 py-3">SKU</th>
                            <th scope="col" className="px-6 py-3">Categoría</th>
                            <th scope="col" className="px-6 py-3 text-right">Stock Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockProductos.sort((a,b) => a.stock - b.stock).map((producto) => (
                             <tr key={producto.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {producto.nombre}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{producto.sku}</td>
                                <td className="px-6 py-4">{producto.categoria}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-bold ${producto.stock <= lowStockThreshold ? 'text-red-500' : ''}`}>
                                        {producto.stock <= lowStockThreshold && <AlertCircleIcon className="w-4 h-4 inline-block mr-1.5" />}
                                        {producto.stock} uds.
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default POSStock;
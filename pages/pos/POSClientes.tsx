import React from 'react';
import { SearchIcon, PlusIcon } from '../../components/icons';
import { mockClientes } from '../../data/mockData';

const POSClientes: React.FC = () => {
    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Clientes del Negocio</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Busca o registra nuevos clientes.</p>
                </div>
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nuevo Cliente
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockClientes.slice(0, 10).map((cliente) => (
                             <tr key={cliente.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {cliente.nombre}
                                </td>
                                <td className="px-6 py-4">{cliente.email}</td>
                                <td className="px-6 py-4">{cliente.telefono}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default POSClientes;
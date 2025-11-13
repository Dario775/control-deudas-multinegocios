import React from 'react';
import { SaveIcon, PrinterIcon } from '../../components/icons';

const POSSettings: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Configuración del Terminal</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ajustes de la cuenta de usuario y del hardware.</p>
            
            <div className="mt-8 space-y-8 max-w-2xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6">Mi Cuenta</h3>
                     <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Nombre de Usuario</label>
                            <input type="text" defaultValue="Ana Gómez (Cajera)" disabled className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-transparent focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" defaultValue="cajero@lafamilia.com" disabled className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-transparent focus:ring-0" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="button" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Cambiar Contraseña</button>
                        </div>
                    </form>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                     <h3 className="text-xl font-semibold mb-6">Hardware y Periféricos</h3>
                     <form className="space-y-6">
                        <div>
                            <label htmlFor="printer" className="block text-sm font-medium mb-1.5">Impresora de Tickets</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <PrinterIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <select id="printer" className="block w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition">
                                    <option>Epson TM-T20II (USB)</option>
                                    <option>Star TSP100 (Red)</option>
                                    <option>No imprimir tickets</option>
                                </select>
                            </div>
                        </div>
                         <div>
                             <button type="submit" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                                <SaveIcon className="w-4 h-4 mr-2" />
                                Guardar Configuración
                            </button>
                        </div>
                     </form>
                </div>
            </div>
        </div>
    );
};

export default POSSettings;
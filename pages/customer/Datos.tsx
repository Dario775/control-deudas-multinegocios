
import React from 'react';

const CustomerDatos: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Mis Datos Personales</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Mantén tu información de contacto actualizada.</p>

            <div className="mt-8 space-y-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Nombre Completo</label>
                            <input type="text" defaultValue="Maria García" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" defaultValue="maria.garcia@example.com" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Teléfono</label>
                            <input type="tel" defaultValue="555-5678" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Dirección</label>
                            <input type="text" defaultValue="Calle Falsa 123, Ciudad" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Cambios</button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Contraseña Actual</label>
                            <input type="password" placeholder="********" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div></div>
                        <div>
                            <label className="block text-sm font-medium">Nueva Contraseña</label>
                            <input type="password" placeholder="********" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Confirmar Nueva Contraseña</label>
                            <input type="password" placeholder="********" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Actualizar Contraseña</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CustomerDatos;

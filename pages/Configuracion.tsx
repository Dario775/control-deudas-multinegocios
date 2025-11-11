import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const Configuracion: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [daysBefore, setDaysBefore] = useState(3);
    const [daysAfter, setDaysAfter] = useState(5);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Configuración</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ajusta las preferencias de tu negocio y cuenta.</p>
            
            <div className="mt-8 space-y-8">
                {/* Datos del Negocio */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Datos del Negocio</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Nombre del Negocio</label>
                            <input type="text" defaultValue="Mi Empresa Inc." className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">RUC/NIT</label>
                            <input type="text" defaultValue="123456789-0" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email de Contacto</label>
                            <input type="email" defaultValue="contacto@miempresa.com" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Teléfono</label>
                            <input type="tel" defaultValue="+1 234 567 890" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div className="md:col-span-2">
                             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Cambios</button>
                        </div>
                    </form>
                </div>

                {/* Notificaciones Automáticas */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Notificaciones Automáticas</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="flex-grow flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Habilitar recordatorios automáticos</span>
                                <span className="text-sm text-gray-500">Enviar emails a clientes sobre vencimientos y pagos pendientes.</span>
                            </span>
                            <label htmlFor="notifications-switch" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="notifications-switch" className="sr-only" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${notificationsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div>
                                <label className="block text-sm font-medium">Recordatorio de Vencimiento</label>
                                <div className="mt-1 flex items-center">
                                    <span className="mr-2">Enviar</span>
                                    <input type="number" value={daysBefore} onChange={(e) => setDaysBefore(Number(e.target.value))} className="w-16 text-center rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                                    <span className="ml-2">días antes del vencimiento.</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Recordatorio de Pago Vencido</label>
                                 <div className="mt-1 flex items-center">
                                    <span className="mr-2">Enviar</span>
                                    <input type="number" value={daysAfter} onChange={(e) => setDaysAfter(Number(e.target.value))} className="w-16 text-center rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                                    <span className="ml-2">días después si sigue pendiente.</span>
                                </div>
                            </div>
                        </div>
                        <div>
                             <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={!notificationsEnabled}>Guardar Configuración</button>
                        </div>
                    </div>
                </div>

                 {/* Preferencias de la Cuenta */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Preferencias de la Cuenta</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Tema de la Aplicación</label>
                            <select 
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                                className="mt-1 block w-full md:w-1/3 rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0"
                            >
                                <option value="light">Claro</option>
                                <option value="dark">Oscuro</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Idioma</label>
                            <select className="mt-1 block w-full md:w-1/3 rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0">
                                <option>Español</option>
                                <option disabled>Inglés (Próximamente)</option>
                            </select>
                        </div>
                        <div>
                            <button className="text-indigo-600 dark:text-indigo-400 hover:underline">Cambiar Contraseña</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Configuracion;
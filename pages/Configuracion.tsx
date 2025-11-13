import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { BuildingIcon, HashIcon, MailIcon, PhoneIcon, SaveIcon, PaletteIcon, LanguagesIcon, ChevronDown, ClockIcon } from '../components/icons';

const Configuracion: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [daysBefore, setDaysBefore] = useState(3);
    const [daysAfter, setDaysAfter] = useState(5);

    const inputBaseStyle = "block w-full rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition py-2.5";
    const iconWrapperStyle = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Configuración</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ajusta las preferencias de tu negocio y cuenta.</p>
            
            <div className="mt-8 space-y-8">
                {/* Datos del Negocio */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6">Datos del Negocio</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nombre del Negocio</label>
                            <div className="relative">
                                <div className={iconWrapperStyle}><BuildingIcon className="w-5 h-5 text-gray-400" /></div>
                                <input type="text" id="businessName" defaultValue="Mi Empresa Inc." className={`${inputBaseStyle} pl-10 pr-4`} />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="businessId" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">RUC/NIT</label>
                             <div className="relative">
                                <div className={iconWrapperStyle}><HashIcon className="w-5 h-5 text-gray-400" /></div>
                                <input type="text" id="businessId" defaultValue="123456789-0" className={`${inputBaseStyle} pl-10 pr-4`} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="businessEmail" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email de Contacto</label>
                            <div className="relative">
                                <div className={iconWrapperStyle}><MailIcon className="w-5 h-5 text-gray-400" /></div>
                                <input type="email" id="businessEmail" defaultValue="contacto@miempresa.com" className={`${inputBaseStyle} pl-10 pr-4`} />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="businessPhone" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Teléfono</label>
                             <div className="relative">
                                <div className={iconWrapperStyle}><PhoneIcon className="w-5 h-5 text-gray-400" /></div>
                                <input type="tel" id="businessPhone" defaultValue="+1 234 567 890" className={`${inputBaseStyle} pl-10 pr-4`} />
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-2">
                             <button type="submit" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                                <SaveIcon className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notificaciones Automáticas */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6">Notificaciones Automáticas</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <span className="flex-grow flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-gray-100">Habilitar recordatorios automáticos</span>
                                <span className="text-sm text-gray-500">Enviar emails a clientes sobre vencimientos y pagos pendientes.</span>
                            </span>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${notificationsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Recordatorio de Vencimiento</label>
                                <div className="relative">
                                    <div className={iconWrapperStyle}><ClockIcon className="w-5 h-5 text-gray-400" /></div>
                                    <input type="number" value={daysBefore} onChange={(e) => setDaysBefore(Number(e.target.value))} className={`${inputBaseStyle} pl-10 text-center`} />
                                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-500 pointer-events-none">días antes</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Notificación de Pago Vencido</label>
                                 <div className="relative">
                                    <div className={iconWrapperStyle}><ClockIcon className="w-5 h-5 text-gray-400" /></div>
                                    <input type="number" value={daysAfter} onChange={(e) => setDaysAfter(Number(e.target.value))} className={`${inputBaseStyle} pl-10 text-center`} />
                                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-500 pointer-events-none">días después</span>
                                </div>
                            </div>
                        </div>
                        <div>
                             <button type="button" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={!notificationsEnabled}>
                                <SaveIcon className="w-4 h-4 mr-2" />
                                Guardar Configuración
                             </button>
                        </div>
                    </div>
                </div>

                 {/* Preferencias de la Cuenta */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6">Preferencias de la Cuenta</h3>
                    <div className="space-y-6 max-w-sm">
                        <div>
                            <label htmlFor="themeSelect" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tema de la Aplicación</label>
                            <div className="relative">
                                <div className={iconWrapperStyle}><PaletteIcon className="w-5 h-5 text-gray-400" /></div>
                                <select 
                                    id="themeSelect"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                                    className={`${inputBaseStyle} pl-10 pr-10 appearance-none`}
                                >
                                    <option value="light">Claro</option>
                                    <option value="dark">Oscuro</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown className="w-5 h-5 text-gray-400" /></div>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="langSelect" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Idioma</label>
                            <div className="relative">
                                <div className={iconWrapperStyle}><LanguagesIcon className="w-5 h-5 text-gray-400" /></div>
                                <select id="langSelect" className={`${inputBaseStyle} pl-10 pr-10 appearance-none`}>
                                    <option>Español</option>
                                    <option disabled>Inglés (Próximamente)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown className="w-5 h-5 text-gray-400" /></div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Cambiar Contraseña</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Configuracion;
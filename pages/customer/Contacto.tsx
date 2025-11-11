
import React from 'react';
import { MailIcon, PhoneIcon } from '../../components/icons';

const CustomerContacto: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Contactar a Soporte</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">¿Tienes alguna pregunta? Envíanos un mensaje.</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Enviar un mensaje</h3>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium">Asunto</label>
                            <input type="text" id="subject" placeholder="Ej: Problema con mi último pago" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium">Mensaje</label>
                            <textarea id="message" rows={6} placeholder="Describe tu problema o consulta aquí..." className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Enviar Mensaje</button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <MailIcon className="w-5 h-5 mt-1 mr-3 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="font-medium">Email</p>
                                <a href="mailto:soporte@miempresa.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">soporte@miempresa.com</a>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <PhoneIcon className="w-5 h-5 mt-1 mr-3 text-gray-500 dark:text-gray-400" />
                             <div>
                                <p className="font-medium">Teléfono</p>
                                <p className="text-gray-600 dark:text-gray-300">+1 234 567 890</p>
                            </div>
                        </div>
                         <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                             <h4 className="font-semibold">Horario de Atención</h4>
                             <p className="text-sm text-gray-500 dark:text-gray-400">Lunes a Viernes</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">9:00 AM - 5:00 PM</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerContacto;

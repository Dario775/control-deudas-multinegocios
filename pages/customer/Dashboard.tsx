import React from 'react';
import { CreditCardIcon, PackageIcon } from '../../components/icons';
import { Pago, PaymentStatus } from '../../types';
import { latestPaymentsCustomer } from '../../data/mockData';


const statusColors: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Pagada]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PaymentStatus.Pendiente]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PaymentStatus.Vencida]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PaymentStatus.Cancelada]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const CustomerDashboard: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Bienvenida, Maria García</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Aquí tienes un resumen de tu cuenta.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        <PackageIcon className="w-6 h-6 mr-3 text-indigo-500"/>
                        Tu Suscripción Actual
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Plan:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">Profesional</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Estado:</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Activo</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Próximo Pago:</span>
                            <span>20/11/2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Monto a Pagar:</span>
                            <span className="font-bold text-xl">$79.00</span>
                        </div>
                    </div>
                     <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Realizar Pago
                        </button>
                         <a href="#/portal/suscripcion" className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            Gestionar Suscripción
                        </a>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        <CreditCardIcon className="w-6 h-6 mr-3 text-indigo-500" />
                        Historial de Pagos Recientes
                    </h3>
                    <ul className="space-y-4">
                        {latestPaymentsCustomer.map(pago => (
                             <li key={pago.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">${pago.monto.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{pago.fechaPago}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[pago.estado]}`}>
                                    {pago.estado}
                                  </span>
                            </li>
                        ))}
                    </ul>
                    <a href="#/portal/pagos" className="mt-4 block text-center text-indigo-600 dark:text-indigo-400 hover:underline">
                        Ver todo el historial
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
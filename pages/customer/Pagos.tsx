import React from 'react';
import { Pago, PaymentStatus, PaymentMethod } from '../../types';
import { DownloadIcon } from '../../components/icons';
import { customerPagos } from '../../data/mockData';

const statusColors: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Pagada]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PaymentStatus.Pendiente]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PaymentStatus.Vencida]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PaymentStatus.Cancelada]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};


const CustomerPagos: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Mi Historial de Pagos</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Consulta y descarga tus comprobantes de pago.</p>
      
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID Transacción</th>
              <th scope="col" className="px-6 py-3">Fecha de Pago</th>
              <th scope="col" className="px-6 py-3">Monto</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customerPagos.map((pago) => (
              <tr key={pago.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-mono text-xs">PAY-{pago.id}-{pago.fechaPago.replace(/\//g, '')}</td>
                <td className="px-6 py-4">{pago.fechaPago}</td>
                <td className="px-6 py-4 font-medium">${pago.monto.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[pago.estado]}`}>
                    {pago.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Comprobante
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPagos;
import React from 'react';
import { Venta } from '../../types';
import { XIcon } from '../icons';

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venta: Venta;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ isOpen, onClose, venta }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Detalle de Venta <span className="font-mono text-indigo-500">#{venta.receiptNumber}</span></h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</h4>
              <p className="font-semibold">{venta.client?.nombre || 'Cliente Genérico'}</p>
            </div>
            <div className="text-left sm:text-right">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha y Hora</h4>
              <p className="font-semibold">{venta.date}</p>
            </div>
          </div>

          <div className="border dark:border-gray-700 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Producto</th>
                  <th className="px-4 py-2 text-center font-semibold">Cant.</th>
                  <th className="px-4 py-2 text-right font-semibold">Precio Unit.</th>
                  <th className="px-4 py-2 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {venta.items.map(item => (
                  <tr key={item.producto.id}>
                    <td className="px-4 py-2">{item.producto.nombre}</td>
                    <td className="px-4 py-2 text-center">{item.cantidad}</td>
                    <td className="px-4 py-2 text-right">${item.producto.precio.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-medium">${(item.producto.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal:</span><span>${venta.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Impuestos:</span><span>${venta.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-1 border-t mt-1"><span>Total:</span><span>${venta.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailModal;

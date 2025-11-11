import React from 'react';
import { Factura } from '../../types';
import { XIcon } from '../icons';

interface FacturaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura;
}

const FacturaViewModal: React.FC<FacturaViewModalProps> = ({ isOpen, onClose, factura }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Factura #{factura.numero}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">Cliente:</h4>
                <p className="font-bold text-lg">{factura.cliente.nombre}</p>
                <p>{factura.cliente.email}</p>
            </div>
            <div className="text-right">
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Fecha de Emisión:</span> {factura.fechaEmision}</p>
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Fecha de Vencimiento:</span> {factura.fechaVencimiento}</p>
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Estado:</span> <span className="font-bold">{factura.estado}</span></p>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-2">Descripción</th>
                        <th className="px-4 py-2 text-right">Cantidad</th>
                        <th className="px-4 py-2 text-right">Precio Unitario</th>
                        <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {factura.items.map(item => (
                        <tr key={item.id}>
                            <td className="px-4 py-3">{item.descripcion}</td>
                            <td className="px-4 py-3 text-right">{item.cantidad}</td>
                            <td className="px-4 py-3 text-right">${item.precioUnitario.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs space-y-2 text-sm">
                 <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span>${factura.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Impuestos (21%):</span>
                    <span>${factura.impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                    <span>Total:</span>
                    <span>${factura.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        {factura.notas && (
            <div className="mt-6 pt-4 border-t dark:border-gray-600">
                <h4 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Notas:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{factura.notas}</p>
            </div>
        )}

        <div className="flex justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default FacturaViewModal;
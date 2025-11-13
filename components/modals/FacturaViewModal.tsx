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
    <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="factura-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 id="factura-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Detalle de Factura <span className="font-mono text-indigo-500">#{factura.numero}</span>
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</h4>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{factura.cliente.nombre}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{factura.cliente.email}</p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                    <p className="text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Fecha de Emisión:</span> <span className="text-gray-800 dark:text-gray-200">{factura.fechaEmision}</span></p>
                    <p className="text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Fecha de Vencimiento:</span> <span className="text-gray-800 dark:text-gray-200">{factura.fechaVencimiento}</span></p>
                    <p className="text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Estado:</span> <span className="font-bold text-gray-800 dark:text-gray-200">{factura.estado}</span></p>
                </div>
            </div>

            <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-600 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Descripción</th>
                            <th className="px-4 py-3 text-right font-semibold">Cantidad</th>
                            <th className="px-4 py-3 text-right font-semibold">Precio Unit.</th>
                            <th className="px-4 py-3 text-right font-semibold">Total</th>
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
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notas:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">{factura.notas}</p>
                </div>
            )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default FacturaViewModal;
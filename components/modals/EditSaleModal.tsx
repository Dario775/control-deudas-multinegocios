import React, { useState, useEffect } from 'react';
import { Venta, ReceiptType } from '../../types';
import { XIcon, ChevronDown } from '../icons';

interface EditSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venta: Venta) => void;
  ventaToEdit: Venta;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ isOpen, onClose, onSave, ventaToEdit }) => {
  const [receiptType, setReceiptType] = useState<ReceiptType>(ventaToEdit.receiptType);

  useEffect(() => {
    if (isOpen) {
      setReceiptType(ventaToEdit.receiptType);
    }
  }, [isOpen, ventaToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...ventaToEdit, receiptType });
  };
  
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Editar Comprobante</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Comprobante Nº: {ventaToEdit.receiptNumber}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="receiptType" className="block text-sm font-medium mb-1.5">Tipo de Comprobante</label>
            <div className="relative">
              <select 
                id="receiptType" 
                value={receiptType} 
                onChange={e => setReceiptType(e.target.value as ReceiptType)} 
                className="w-full py-2.5 pl-3 pr-10 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none"
              >
                {Object.values(ReceiptType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;

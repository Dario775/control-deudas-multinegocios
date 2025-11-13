import React, { useState } from 'react';
import { XIcon, PercentIcon } from '../icons';

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (discount: number) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, onApply }) => {
    const [discount, setDiscount] = useState('');

    if (!isOpen) return null;

    const handleApply = () => {
        const discountValue = parseFloat(discount);
        if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
            onApply(discountValue);
        } else {
            alert('Por favor, introduce un porcentaje de descuento válido (0-100).');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm border dark:border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Aplicar Descuento</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <label htmlFor="discount" className="block text-sm font-medium mb-2">Porcentaje de Descuento (%)</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="discount"
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                            className="w-full text-center text-3xl font-bold p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0"
                            min="0"
                            max="100"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <PercentIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
                    <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Aplicar</button>
                </div>
            </div>
        </div>
    );
};

export default DiscountModal;

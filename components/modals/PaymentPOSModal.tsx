import React from 'react';
import { CheckCircle2Icon, PrinterIcon } from '../icons';

interface PaymentPOSModalProps {
    isOpen: boolean;
    onClose: () => void; // Now triggers a new sale
    changeToReturn: number;
}

const PaymentPOSModal: React.FC<PaymentPOSModalProps> = ({ isOpen, onClose, changeToReturn }) => {
    if (!isOpen) return null;

    const handleNewSale = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border dark:border-gray-700" onClick={e => e.stopPropagation()}>
                 <div className="p-8 flex flex-col items-center text-center">
                    <CheckCircle2Icon className="w-20 h-20 text-green-500 mb-4"/>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¡Venta Exitosa!</h2>
                    {changeToReturn > 0 && (
                        <div className="mt-4">
                            <p className="text-lg text-gray-500 dark:text-gray-400">Cambio a devolver:</p>
                            <p className="text-5xl font-extrabold text-green-600 dark:text-green-400">${changeToReturn.toFixed(2)}</p>
                        </div>
                    )}
                    <div className="mt-8 w-full flex flex-col space-y-3">
                        <button onClick={handleNewSale} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
                            Nueva Venta
                        </button>
                         <button onClick={() => alert('Función de impresión no implementada.')} className="w-full py-2 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <PrinterIcon className="w-5 h-5 mr-2" /> Imprimir Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPOSModal;

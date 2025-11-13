import React, { useState, useEffect } from 'react';
import { Pago, PaymentMethod, PaymentStatus } from '../../types';
import { XIcon, CalendarIcon, ChevronDown } from '../icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Pago) => void;
  payment: Pago | null;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSave, payment }) => {
  const [paymentDate, setPaymentDate] = useState(getTodayDate());
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.Tarjeta);

  useEffect(() => {
    if (isOpen) {
      setPaymentDate(getTodayDate());
      setPaymentMethod(payment?.metodo || PaymentMethod.Tarjeta);
    }
  }, [isOpen, payment]);

  if (!isOpen || !payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPayment: Pago = {
        ...payment,
        estado: PaymentStatus.Pagada,
        metodo: paymentMethod,
        fechaPago: paymentDate.split('-').reverse().join('/'), // Convert YYYY-MM-DD to DD/MM/YYYY
    };
    onSave(updatedPayment);
  };
  
  const inputStyle = "block w-full py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";
  
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Registrar Pago</h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
           <p className="text-sm text-gray-500 mt-1">Confirma los detalles para marcar el pago como realizado.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cliente</label>
                    <input type="text" value={payment.cliente.nombre} disabled className="mt-1 block w-full rounded-lg bg-gray-100 dark:bg-gray-700/50 border-transparent focus:ring-0 cursor-not-allowed px-4 py-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto a Pagar</label>
                    <input type="text" value={`$${payment.monto.toFixed(2)}`} disabled className="mt-1 block w-full rounded-lg bg-gray-100 dark:bg-gray-700/50 border-transparent focus:ring-0 cursor-not-allowed text-lg font-semibold px-4 py-2.5" />
                </div>
                <div>
                    <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Pago</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input type="date" id="paymentDate" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className={`${inputStyle} pl-10`} required />
                    </div>
                </div>
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Método de Pago</label>
                    <div className="relative">
                        <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className={`${inputStyle} pl-3 pr-10 appearance-none`} required>
                            {Object.values(PaymentMethod).map(method => <option key={method} value={method}>{method}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors">Confirmar Pago</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
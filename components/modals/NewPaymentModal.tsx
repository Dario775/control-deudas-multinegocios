import React, { useState, useMemo } from 'react';
import { Pago, PaymentMethod } from '../../types';
import { XIcon, CalendarIcon, DollarSignIcon, CheckIcon, UserIcon, ChevronDown } from '../icons';
import { mockClientes } from '../../data/mockData';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: Omit<Pago, 'id' | 'estado' | 'fechaPago' | 'descripcion'> & { fechaPago: string, descripcion?: string }) => void;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(getTodayDate());
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.Tarjeta);
  const [description, setDescription] = useState('');

  const selectedClient = useMemo(() => {
    return mockClientes.find(c => c.id === selectedClientId);
  }, [selectedClientId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentDate > getTodayDate()) {
        alert("La fecha de pago no puede ser en el futuro. Por favor, selecciona una fecha válida.");
        return;
    }
    
    const parsedAmount = parseFloat(amount);

    if (!selectedClient) {
        alert("Por favor, selecciona un cliente.");
        return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Por favor, introduce un monto válido mayor a cero.");
        return;
    }
     if (!paymentDate) {
        alert("Por favor, selecciona una fecha de pago.");
        return;
    }

    onSave({
      cliente: { id: selectedClient.id, nombre: selectedClient.nombre, email: selectedClient.email },
      monto: parsedAmount,
      metodo: paymentMethod,
      fechaPago: paymentDate,
      descripcion: description,
    });
    
    // Reset form for next time
    setSelectedClientId('');
    setAmount('');
    setPaymentDate(getTodayDate());
    setPaymentMethod(PaymentMethod.Tarjeta);
    setDescription('');
  };
  
  const inputStyle = "block w-full py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border dark:border-gray-700 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Registrar un Pago</h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Registra un pago manual para cualquier cliente del sistema.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div>
                    <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cliente *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <select 
                            id="client-select" 
                            value={selectedClientId} 
                            onChange={(e) => setSelectedClientId(e.target.value)} 
                            className={`${inputStyle} pl-10 appearance-none`}
                            required
                        >
                            <option value="" disabled>Selecciona un cliente</option>
                            {mockClientes.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(client => (
                                <option key={client.id} value={client.id}>{client.nombre}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    {selectedClient && (
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">Email: {selectedClient.email}</p>
                    )}
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto del Pago *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <DollarSignIcon className="w-5 h-5"/>
                        </div>
                        <input 
                            type="number" 
                            id="amount" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`${inputStyle} pl-12 text-lg font-semibold`}
                            placeholder="0.00"
                            required 
                            min="0.01"
                            step="0.01"
                        />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Pago</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input type="date" id="paymentDate" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} max={getTodayDate()} className={`${inputStyle} pl-10`} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Método de Pago</label>
                         <div className="relative">
                            <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className={`${inputStyle} pl-3 appearance-none`} required>
                                {Object.values(PaymentMethod).map(method => <option key={method} value={method}>{method}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Concepto o Descripción (Opcional)</label>
                    <textarea 
                        id="description" 
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputStyle}
                        placeholder="Ej: Abono a factura FACT-003, pago de servicio extra, etc."
                    />
                </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors inline-flex items-center">
                    <CheckIcon className="w-5 h-5 mr-2 -ml-1"/>
                    Guardar Pago
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewPaymentModal;
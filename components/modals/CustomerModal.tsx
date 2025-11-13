import React, { useState, useEffect } from 'react';
import { Cliente, Plan, ClientStatus } from '../../types';
import { XIcon, UserIcon, MailIcon, PhoneIcon, ChevronDown } from '../icons';
import { mockPlanes } from '../../data/mockData';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Cliente) => void;
  customerToEdit?: Cliente | null;
  isReadOnly: boolean;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, customerToEdit, isReadOnly }) => {
  const getInitialState = (): Cliente => {
    if (customerToEdit) {
      return customerToEdit;
    }
    return {
      id: Date.now().toString(),
      nombre: '',
      email: '',
      telefono: '',
      fechaRegistro: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric'}),
      estado: ClientStatus.Activo,
      plan: mockPlanes[0],
    };
  };

  const [customer, setCustomer] = useState<Cliente>(getInitialState());

  useEffect(() => {
    setCustomer(getInitialState());
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };
  
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlan = mockPlanes.find(p => p.id === e.target.value);
    if (selectedPlan) {
        setCustomer({ ...customer, plan: selectedPlan });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    // Validations
    if (customer.nombre.trim() === '') {
        alert('El nombre del cliente no puede estar vacío.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
        alert('Por favor, introduce una dirección de email válida.');
        return;
    }

    onSave(customer);
  };
  
  const inputBaseStyle = "block w-full py-2.5 rounded-lg border-transparent transition";
  const readOnlyInputStyle = "bg-transparent focus:ring-0 cursor-default";
  const editableInputStyle = "bg-gray-100 dark:bg-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";


  return (
    <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl max-h-[95vh] flex flex-col border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {isReadOnly ? 'Perfil de Cliente' : (customerToEdit ? 'Editar Cliente' : 'Nuevo Cliente')}
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
                {isReadOnly ? 'Información detallada del cliente.' : 'Ingresa la información del cliente para registrarlo en el sistema.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre Completo</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="text" name="nombre" id="nombre" value={customer.nombre} onChange={handleInputChange} className={`${inputBaseStyle} pl-10 pr-4 ${isReadOnly ? readOnlyInputStyle : editableInputStyle}`} required disabled={isReadOnly} />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input type="email" name="email" id="email" value={customer.email} onChange={handleInputChange} className={`${inputBaseStyle} pl-10 pr-4 ${isReadOnly ? readOnlyInputStyle : editableInputStyle}`} required disabled={isReadOnly} />
                    </div>
                   </div>
                   <div>
                     <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teléfono</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input type="tel" name="telefono" id="telefono" value={customer.telefono} onChange={handleInputChange} className={`${inputBaseStyle} pl-10 pr-4 ${isReadOnly ? readOnlyInputStyle : editableInputStyle}`} disabled={isReadOnly} />
                    </div>
                   </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Plan</label>
                    <div className="relative">
                        <select name="plan" id="plan" value={customer.plan.id} onChange={handlePlanChange} className={`appearance-none ${inputBaseStyle} pl-4 pr-10 ${isReadOnly ? readOnlyInputStyle : editableInputStyle}`} disabled={isReadOnly}>
                          {mockPlanes.map(p => <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}/{p.periodo}</option>)}
                        </select>
                         <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${isReadOnly ? 'hidden' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
                    <div className="relative">
                        <select name="estado" id="estado" value={customer.estado} onChange={handleInputChange} className={`appearance-none ${inputBaseStyle} pl-4 pr-10 ${isReadOnly ? readOnlyInputStyle : editableInputStyle}`} disabled={isReadOnly}>
                           {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${isReadOnly ? 'hidden' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                  </div>
               </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
            {isReadOnly ? (
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
            ) : (
                <>
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors">Guardar Cliente</button>
                </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
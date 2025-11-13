import React, { useState, useEffect } from 'react';
import { Gasto, ExpenseCategory } from '../../types';
import { XIcon, DollarSignIcon, CalendarIcon, ChevronDown, FileTextIcon } from '../icons';
import { displayToInputDate, inputToDisplayDate, getTodayDateInput } from '../../utils/date';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gasto: Gasto) => void;
  expenseToEdit?: Gasto | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, expenseToEdit }) => {
  const getInitialState = (): Omit<Gasto, 'id' | 'fecha'> & { fecha: string } => ({
    descripcion: '',
    monto: 0,
    fecha: getTodayDateInput(),
    categoria: ExpenseCategory.Eventuales,
  });

  const [gasto, setGasto] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setGasto({
          ...expenseToEdit,
          fecha: displayToInputDate(expenseToEdit.fecha),
        });
      } else {
        setGasto(getInitialState());
      }
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGasto({ ...gasto, [name]: name === 'monto' ? parseFloat(value) : value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (gasto.descripcion.trim() === '') {
        alert("La descripción del gasto es obligatoria.");
        return;
    }
    const parsedMonto = Number(gasto.monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
        alert("El monto debe ser un valor positivo.");
        return;
    }
    if (!gasto.fecha) {
        alert("La fecha es obligatoria.");
        return;
    }

    const finalGasto: Gasto = {
        ...gasto,
        id: expenseToEdit?.id || Date.now().toString(),
        fecha: inputToDisplayDate(gasto.fecha),
        monto: parsedMonto
    };
    onSave(finalGasto);
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {expenseToEdit ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Completa la información del gasto o compra.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileTextIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input type="text" name="descripcion" id="descripcion" value={gasto.descripcion} onChange={handleInputChange} className={`${inputStyle} pl-10`} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto ($) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSignIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="number" name="monto" id="monto" value={gasto.monto} onChange={handleInputChange} className={`${inputStyle} pl-10`} required min="0.01" step="0.01" />
                </div>
              </div>
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha *</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="date" name="fecha" id="fecha" value={gasto.fecha} onChange={handleInputChange} className={`${inputStyle} pl-10`} required />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoría *</label>
              <div className="relative">
                <select name="categoria" id="categoria" value={gasto.categoria} onChange={handleInputChange} className={`${inputStyle} pl-3 appearance-none`} required>
                  {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors">Guardar Gasto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
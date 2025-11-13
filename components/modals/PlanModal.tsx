import React, { useState, useEffect } from 'react';
import { Plan, PlanPeriod } from '../../types';
import { PlusIcon, Trash2Icon, XIcon, DollarSignIcon, ChevronDown } from '../icons';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  planToEdit?: Plan | null;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSave, planToEdit }) => {
  const getInitialState = (): Plan => ({
    id: planToEdit ? planToEdit.id : Date.now().toString(),
    nombre: '',
    precio: 0,
    periodo: PlanPeriod.Mensual,
    caracteristicas: [''],
  });

  const [plan, setPlan] = useState<Plan>(getInitialState());
  
  useEffect(() => {
    setPlan(planToEdit || getInitialState());
  }, [planToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: name === 'precio' ? parseFloat(value) : value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newCaracteristicas = [...plan.caracteristicas];
    newCaracteristicas[index] = value;
    setPlan({ ...plan, caracteristicas: newCaracteristicas });
  };

  const addFeature = () => {
    setPlan({ ...plan, caracteristicas: [...plan.caracteristicas, ''] });
  };
  
  const removeFeature = (index: number) => {
    if (plan.caracteristicas.length <= 1) return; // Always keep at least one
    const newCaracteristicas = plan.caracteristicas.filter((_, i) => i !== index);
    setPlan({ ...plan, caracteristicas: newCaracteristicas });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (plan.nombre.trim() === '') {
      alert('El nombre del plan es obligatorio.');
      return;
    }
    if (isNaN(plan.precio) || plan.precio < 0) {
      alert('El precio no puede ser un valor negativo.');
      return;
    }

    const finalPlan = {
      ...plan,
      caracteristicas: plan.caracteristicas.map(c => c.trim()).filter(c => c), // Remove empty features
    };
    
    if(finalPlan.caracteristicas.length === 0) {
        alert('El plan debe tener al menos una característica.');
        return;
    }

    onSave(finalPlan);
  };
  
  const inputStyle = "block w-full py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl max-h-[95vh] flex flex-col border dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {planToEdit ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Define los detalles y características de la suscripción.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre del Plan</label>
              <input type="text" name="nombre" id="nombre" value={plan.nombre} onChange={handleInputChange} className={`${inputStyle} px-4`} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Precio ($)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSignIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="number" name="precio" id="precio" value={plan.precio} onChange={handleInputChange} className={`${inputStyle} pl-10`} required min="0" step="0.01" />
                </div>
              </div>
              <div>
                <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Período</label>
                <div className="relative">
                    <select name="periodo" id="periodo" value={plan.periodo} onChange={handleInputChange} className={`${inputStyle} px-3 appearance-none`}>
                        {Object.values(PlanPeriod).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Características</label>
              <div className="space-y-2 mt-1">
                {plan.caracteristicas.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className={`${inputStyle} px-3`} placeholder={`Característica ${index + 1}`} />
                    <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" disabled={plan.caracteristicas.length <= 1}>
                      <Trash2Icon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFeature} className="mt-3 flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                <PlusIcon className="w-4 h-4 mr-1" />
                Añadir característica
              </button>
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors">Guardar Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
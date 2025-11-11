import React, { useState, useEffect } from 'react';
import { Plan, PlanPeriod } from '../../types';
import { PlusIcon, Trash2Icon, XIcon } from '../icons';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  planToEdit?: Plan | null;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSave, planToEdit }) => {
  const initialPlanState: Plan = {
    id: planToEdit ? planToEdit.id : Date.now().toString(),
    nombre: '',
    precio: 0,
    periodo: PlanPeriod.Mensual,
    caracteristicas: [''],
  };

  const [plan, setPlan] = useState<Plan>(initialPlanState);
  
  useEffect(() => {
    if (planToEdit) {
      setPlan(planToEdit);
    } else {
      setPlan(initialPlanState);
    }
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
    onSave(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {planToEdit ? 'Editar Plan' : 'Crear Nuevo Plan'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Plan</label>
            <input type="text" name="nombre" id="nombre" value={plan.nombre} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio ($)</label>
              <input type="number" name="precio" id="precio" value={plan.precio} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" required />
            </div>
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período</label>
              <select name="periodo" id="periodo" value={plan.periodo} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0">
                {Object.values(PlanPeriod).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Características</label>
            <div className="space-y-2 mt-1">
              {plan.caracteristicas.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" placeholder={`Característica ${index + 1}`} />
                  <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" disabled={plan.caracteristicas.length <= 1}>
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addFeature} className="mt-2 flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              <PlusIcon className="w-4 h-4 mr-1" />
              Añadir característica
            </button>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
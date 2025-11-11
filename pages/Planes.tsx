import React, { useState } from 'react';
import { Plan } from '../types';
import { PlusIcon } from '../components/icons';
import PlanCard from '../components/PlanCard';
import PlanModal from '../components/modals/PlanModal';
import { mockPlanes } from '../data/mockData';

const Planes: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>(mockPlanes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  
  const handleOpenModal = (plan?: Plan) => {
    setPlanToEdit(plan || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setPlanToEdit(null);
    setIsModalOpen(false);
  };

  const handleSavePlan = (planData: Plan) => {
    setPlanes(prevPlanes => {
      const planExists = prevPlanes.some(p => p.id === planData.id);
      if (planExists) {
        return prevPlanes.map(p => p.id === planData.id ? planData : p);
      } else {
        return [...prevPlanes, planData];
      }
    });
    handleCloseModal();
  };
  
  const handleDeletePlan = (planId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan? Esta acción es permanente.')) {
      setPlanes(prevPlanes => prevPlanes.filter(p => p.id !== planId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Planes y Servicios</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Crea y administra los planes de suscripción para tus clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Nuevo Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planes.map(plan => (
          <PlanCard 
            key={plan.id} 
            plan={plan}
            onEdit={() => handleOpenModal(plan)}
            onDelete={() => handleDeletePlan(plan.id)}
          />
        ))}
      </div>
      
      <PlanModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
        planToEdit={planToEdit}
      />
    </div>
  );
};

export default Planes;
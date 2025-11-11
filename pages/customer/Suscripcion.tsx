import React from 'react';
import { Plan } from '../../types';
import { currentCustomerPlan, otherCustomerPlans } from '../../data/mockData';

const PlanCard: React.FC<{ plan: Plan, isCurrent: boolean }> = ({ plan, isCurrent }) => (
    <div className={`rounded-lg shadow-md border p-6 flex flex-col ${isCurrent ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{plan.nombre}</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.precio}</span>
            <span className="text-base font-medium">/{plan.periodo}</span>
        </p>
        <ul className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300 flex-grow">
            {plan.caracteristicas.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    {feature}
                </li>
            ))}
        </ul>
        {isCurrent ? (
             <button disabled className="mt-8 w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed">
                Plan Actual
            </button>
        ) : (
            <button className="mt-8 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Cambiar a este Plan
            </button>
        )}
    </div>
);

const CustomerSuscripcion: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Mi Suscripción</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona tu plan actual, cambia o cancela tu suscripción.</p>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Plan Actual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PlanCard plan={currentCustomerPlan} isCurrent={true} />
                </div>
            </div>

            <div className="mt-12">
                 <h3 className="text-2xl font-semibold mb-4">Cambiar de Plan</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCustomerPlans.map(plan => <PlanCard key={plan.id} plan={plan} isCurrent={false} />)}
                </div>
            </div>

             <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-900">
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Cancelar Suscripción</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Si cancelas tu suscripción, perderás acceso a las funciones del plan Profesional al final de tu ciclo de facturación actual (20/11/2023). Esta acción no se puede deshacer.</p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Cancelar mi Suscripción
                </button>
            </div>
        </div>
    );
};

export default CustomerSuscripcion;
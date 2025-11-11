import React from 'react';
import { Plan } from '../types';
import { PencilIcon, Trash2Icon } from './icons';

interface PlanCardProps {
    plan: Plan;
    onEdit: () => void;
    onDelete: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{plan.nombre}</h3>
            <div className="flex space-x-2">
                <button onClick={onEdit} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.precio}</span>
            <span className="text-base font-medium">/{plan.periodo}</span>
        </p>
        <ul className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300 flex-grow">
            {plan.caracteristicas.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    {feature.trim() ? feature : <span className="italic text-gray-400">Característica vacía</span>}
                </li>
            ))}
        </ul>
    </div>
);

export default PlanCard;
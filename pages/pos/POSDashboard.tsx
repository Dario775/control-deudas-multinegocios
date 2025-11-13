import React from 'react';
import Card from '../../components/ui/Card';
import { DollarSignIcon, ReceiptTextIcon, UsersIcon } from '../../components/icons';

const POSDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard del POS</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen de ventas y actividad de hoy.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Card 
                    title="Ventas de Hoy"
                    value="$1,250.75"
                    change="+5% vs ayer"
                    changeType="positive"
                    icon={<DollarSignIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Transacciones de Hoy"
                    value="84"
                    icon={<ReceiptTextIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Nuevos Clientes Hoy"
                    value="5"
                    icon={<UsersIcon className="w-6 h-6" />}
                />
            </div>
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Actividad Reciente</h3>
                 <p className="text-center text-gray-500 py-6">El registro de actividad aún no está implementado.</p>
            </div>
        </div>
    );
};

export default POSDashboard;
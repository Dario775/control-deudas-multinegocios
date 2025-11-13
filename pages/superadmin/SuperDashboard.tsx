import React from 'react';
import Card from '../../components/ui/Card';
import { BuildingIcon, UsersIcon, DollarSignIcon } from '../../components/icons';
import { mockNegocios } from '../../data/mockData';
import { SuscripcionStatus } from '../../types';

const SuperDashboard: React.FC = () => {
    const totalNegocios = mockNegocios.length;
    const suscripcionesActivas = mockNegocios.filter(n => n.estadoSuscripcion === SuscripcionStatus.Activa).length;
    const ingresosMensuales = suscripcionesActivas * 79; // Asumiendo un MRR promedio

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Global</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen general de toda la plataforma.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Card 
                    title="Total de Negocios"
                    value={totalNegocios.toString()}
                    icon={<BuildingIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Suscripciones Activas"
                    value={suscripcionesActivas.toString()}
                    icon={<UsersIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Ingresos Mensuales (MRR Est.)"
                    value={`$${ingresosMensuales.toLocaleString('es-ES')}`}
                    icon={<DollarSignIcon className="w-6 h-6" />}
                />
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Próximas Funcionalidades</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                    <li>Gráfico de crecimiento de negocios y MRR.</li>
                    <li>Registro de actividad reciente en la plataforma.</li>
                    <li>Gestión centralizada de plantillas de planes.</li>
                </ul>
            </div>
        </div>
    );
};

export default SuperDashboard;

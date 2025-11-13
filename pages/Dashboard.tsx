import React from 'react';
import Card from '../components/ui/Card';
import { UsersIcon, CreditCardIcon, PackageIcon, LandmarkIcon, BanknoteIcon } from '../components/icons';
import IncomeChart from '../components/charts/IncomeChart';
import { latestPaymentsDashboard, mockPaymentStatusSummary } from '../data/mockData';
import PaymentStatusWidget from '../components/PaymentStatusWidget';
import { PaymentMethod } from '../types';

const getPaymentMethodInfo = (method: PaymentMethod) => {
    switch (method) {
        case PaymentMethod.Tarjeta:
            return { icon: <CreditCardIcon className="w-4 h-4" />, text: 'Tarjeta' };
        case PaymentMethod.Transferencia:
            return { icon: <LandmarkIcon className="w-4 h-4" />, text: 'Transferencia' };
        case PaymentMethod.Efectivo:
            return { icon: <BanknoteIcon className="w-4 h-4" />, text: 'Efectivo' };
        default:
            return { icon: null, text: method };
    }
};

const Dashboard: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen general de tu negocio.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <Card 
                    title="Ingresos Totales (Mes)"
                    value="$12,540"
                    change="+12.5% vs mes anterior"
                    changeType="positive"
                    icon={<CreditCardIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Clientes Activos"
                    value="320"
                    change="-1.2% vs mes anterior"
                    changeType="negative"
                    icon={<UsersIcon className="w-6 h-6" />}
                />
                <Card 
                    title="Suscripciones Activas"
                    value="450"
                    change="+20 nuevas este mes"
                    changeType="positive"
                    icon={<PackageIcon className="w-6 h-6" />}
                />
                <PaymentStatusWidget data={mockPaymentStatusSummary} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <IncomeChart />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Últimos Pagos Registrados</h3>
                    <ul className="space-y-4">
                        {latestPaymentsDashboard.map(pago => {
                            const methodInfo = getPaymentMethodInfo(pago.metodo);
                            return (
                                <li key={pago.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{pago.cliente.nombre}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{pago.fechaPago}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-500">${pago.monto.toFixed(2)}</p>
                                        <div className="flex items-center justify-end space-x-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {methodInfo.icon}
                                            <span>{methodInfo.text}</span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
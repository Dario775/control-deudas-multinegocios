import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2Icon, AlertCircleIcon, ClockIcon } from './icons';

interface PaymentStatusWidgetProps {
    data: {
        pagados: number;
        atrasados: number;
        porVencer: number;
    }
}

const PaymentStatusWidget: React.FC<PaymentStatusWidgetProps> = ({ data }) => {
    const navigate = useNavigate();

    const statuses = [
        {
            label: 'Pagados a la fecha',
            value: data.pagados,
            Icon: CheckCircle2Icon,
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/50',
            filter: 'Pagada'
        },
        {
            label: 'Pagos Atrasados',
            value: data.atrasados,
            Icon: AlertCircleIcon,
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/50',
            filter: 'Vencida'
        },
        {
            label: 'Por Vencer (7 días)',
            value: data.porVencer,
            Icon: ClockIcon,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
            filter: 'Pendiente'
        }
    ];

    const handleStatusClick = (filter: string) => {
        navigate(`/pagos?status=${filter.toLowerCase()}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Estado de Pagos</h3>
            <div className="space-y-4 flex-grow flex flex-col justify-around">
                {statuses.map(status => (
                    <div 
                        key={status.label} 
                        className="flex items-center p-2 -m-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleStatusClick(status.filter)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleStatusClick(status.filter)}
                    >
                        <div className={`p-2 rounded-full ${status.bgColor} ${status.color}`}>
                            <status.Icon className="w-5 h-5" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{status.label}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{status.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentStatusWidget;
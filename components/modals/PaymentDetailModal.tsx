import React from 'react';
import { Pago, PaymentStatus, PaymentMethod } from '../../types';
import { XIcon, CreditCardIcon, LandmarkIcon, BanknoteIcon, UserIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from '../icons';

const statusInfo: { [key in PaymentStatus]: { color: string; text: string } } = {
  [PaymentStatus.Pagada]: { color: 'text-green-500', text: 'Pagada' },
  [PaymentStatus.Pendiente]: { color: 'text-yellow-500', text: 'Pendiente' },
  [PaymentStatus.Vencida]: { color: 'text-red-500', text: 'Vencida' },
  [PaymentStatus.Cancelada]: { color: 'text-gray-500', text: 'Cancelada' },
};

const methodInfo: { [key in PaymentMethod]: { icon: React.ReactNode; text: string } } = {
  [PaymentMethod.Tarjeta]: { icon: <CreditCardIcon className="w-5 h-5" />, text: 'Tarjeta de Crédito/Débito' },
  [PaymentMethod.Transferencia]: { icon: <LandmarkIcon className="w-5 h-5" />, text: 'Transferencia' },
  [PaymentMethod.Efectivo]: { icon: <BanknoteIcon className="w-5 h-5" />, text: 'Efectivo' },
};


interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Pago | null;
}

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-8 text-gray-400 mt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const currentStatus = statusInfo[payment.estado];
  const currentMethod = methodInfo[payment.metodo];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border dark:border-gray-700 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Detalle del Pago</h2>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">ID Transacción: {payment.id}</p>
        </div>
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <DetailRow 
                icon={<UserIcon className="w-5 h-5" />}
                label="Cliente"
                value={<>
                    {payment.cliente.nombre}
                    <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">{payment.cliente.email}</span>
                </>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <DetailRow 
                    icon={<DollarSignIcon className="w-5 h-5" />}
                    label="Monto"
                    value={<span className="text-xl">${payment.monto.toFixed(2)}</span>}
                />
                 <DetailRow 
                    icon={<div className={`w-5 h-5 flex items-center justify-center font-bold ${currentStatus.color}`}>•</div>}
                    label="Estado"
                    value={<span className={`font-bold ${currentStatus.color}`}>{currentStatus.text}</span>}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailRow 
                    icon={<CalendarIcon className="w-5 h-5" />}
                    label="Fecha de Pago"
                    value={payment.fechaPago}
                />
                <DetailRow 
                    icon={currentMethod.icon}
                    label="Método de Pago"
                    value={currentMethod.text}
                />
            </div>
            {payment.descripcion && (
                 <DetailRow 
                    icon={<FileTextIcon className="w-5 h-5" />}
                    label="Concepto / Descripción"
                    value={<p className="text-sm font-normal whitespace-pre-wrap">{payment.descripcion}</p>}
                />
            )}
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
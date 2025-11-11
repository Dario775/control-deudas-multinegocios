import React from 'react';
import { Cliente } from '../types';
import { MailIcon, MoreVerticalIcon, PhoneIcon, WhatsappIcon } from './icons';
import { statusColors } from '../pages/Clientes';

interface CustomerCardProps {
    cliente: Cliente;
    openMenuId: string | null;
    onMenuClick: (e: React.MouseEvent, clienteId: string) => void;
    children: React.ReactNode;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ cliente, openMenuId, onMenuClick, children }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{cliente.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Miembro desde: {cliente.fechaRegistro}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[cliente.estado]}`}>
                    {cliente.estado}
                </span>
            </div>
            
            <div className="text-sm space-y-2 flex-grow">
                <p>
                    <span className="font-semibold">Plan: </span>
                    <span className="text-gray-600 dark:text-gray-300">{cliente.plan.nombre}</span>
                </p>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 overflow-hidden">
                    <MailIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${cliente.email}`} className="hover:underline truncate" title={cliente.email}>{cliente.email}</a>
                </div>
                 <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${cliente.telefono}`} className="hover:underline">{cliente.telefono}</a>
                    <a href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="Contactar por WhatsApp" className="text-gray-400 hover:text-green-500">
                        <WhatsappIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-end relative" data-menu-id={cliente.id}>
                <button 
                    onClick={(e) => onMenuClick(e, cliente.id)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <MoreVerticalIcon className="w-5 h-5" />
                </button>
                {openMenuId === cliente.id && children}
            </div>
        </div>
    );
};

export default CustomerCard;
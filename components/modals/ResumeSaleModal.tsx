import React from 'react';
import { HeldTicket } from '../../types';
import { XIcon, PlayIcon } from '../icons';

interface ResumeSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    heldTickets: HeldTicket[];
    onResume: (ticket: HeldTicket) => void;
}

const ResumeSaleModal: React.FC<ResumeSaleModalProps> = ({ isOpen, onClose, heldTickets, onResume }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border dark:border-gray-700 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Reanudar Venta</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {heldTickets.length > 0 ? (
                        <ul className="space-y-2">
                            {heldTickets.map(ticket => (
                                <li key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div>
                                        <p className="font-semibold">
                                            {ticket.client ? ticket.client.nombre : 'Cliente Genérico'}
                                            <span className="ml-2 text-xs font-normal text-gray-500">({ticket.items.length} items)</span>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Total: <span className="font-bold">${ticket.total.toFixed(2)}</span> - {ticket.date.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onResume(ticket)}
                                        className="flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        <PlayIcon className="w-4 h-4 mr-1.5" />
                                        Reanudar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No hay ventas suspendidas.</p>
                    )}
                </div>
                 <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ResumeSaleModal;

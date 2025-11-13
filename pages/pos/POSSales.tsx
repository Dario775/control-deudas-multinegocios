import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Venta, SaleStatus, ReceiptType } from '../../types';
import { mockVentas } from '../../data/mockData';
import { SearchIcon, MoreVerticalIcon, EyeIcon, PencilIcon, Trash2Icon, PrinterIcon, XIcon, UndoIcon } from '../../components/icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import SaleDetailModal from '../../components/modals/SaleDetailModal';
import EditSaleModal from '../../components/modals/EditSaleModal';

const statusColors: { [key in SaleStatus]: string } = {
    [SaleStatus.Completada]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [SaleStatus.Cancelada]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [SaleStatus.Devolución]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

type ModalAction = 'view' | 'edit' | 'print' | 'cancel' | 'return' | 'delete';
type ConfirmableAction = 'cancel' | 'return' | 'delete';

const POSSales: React.FC = () => {
    const [ventas, setVentas] = useState<Venta[]>(mockVentas);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
    const [confirmActionType, setConfirmActionType] = useState<ConfirmableAction | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (openMenuId && menuRef.current && !menuRef.current.contains(target) && !target.closest(`[data-menu-id="${openMenuId}"]`)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [openMenuId]);


    const filteredVentas = useMemo(() => {
        return ventas.filter(venta => {
            const matchesSearch = venta.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (venta.client?.nombre.toLowerCase() || '').includes(searchQuery.toLowerCase());

            const ventaDate = new Date(venta.date.split(' ')[0].split('/').reverse().join('-'));
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if(start) start.setHours(0,0,0,0);
            if(end) end.setHours(23,59,59,999);

            const matchesDate = (!start || ventaDate >= start) && (!end || ventaDate <= end);

            return matchesSearch && matchesDate;
        });
    }, [ventas, searchQuery, startDate, endDate]);

    const handleAction = (action: ModalAction, venta: Venta) => {
        setSelectedVenta(venta);
        setOpenMenuId(null);
        switch(action) {
            case 'view': setIsDetailModalOpen(true); break;
            case 'edit': setIsEditModalOpen(true); break;
            case 'print': navigate(`/pos/receipt/print/${venta.id}`); break;
            case 'cancel': 
            case 'return':
            case 'delete':
                setConfirmActionType(action);
                setIsConfirmModalOpen(true); 
                break;
        }
    };
    
    const confirmAction = () => {
        if (!selectedVenta || !confirmActionType) return;

        switch (confirmActionType) {
            case 'cancel':
                setVentas(prev => prev.map(v => v.id === selectedVenta.id ? {...v, status: SaleStatus.Cancelada} : v));
                break;
            case 'return':
                setVentas(prev => prev.map(v => v.id === selectedVenta.id ? {...v, status: SaleStatus.Devolución, receiptType: ReceiptType.NotaCredito} : v));
                break;
            case 'delete':
                setVentas(prev => prev.filter(v => v.id !== selectedVenta.id));
                break;
        }

        setIsConfirmModalOpen(false);
        setSelectedVenta(null);
        setConfirmActionType(null);
    };
    
    const handleSaveEdit = (editedVenta: Venta) => {
        setVentas(prev => prev.map(v => v.id === editedVenta.id ? editedVenta : v));
        setIsEditModalOpen(false);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Historial de Ventas</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Consulta y gestiona todas las transacciones.</p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Buscar por Nº o cliente..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="py-2 px-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="py-2 px-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Comprobante</th>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVentas.map(venta => (
                            <tr key={venta.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-mono text-xs">{venta.receiptNumber}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{venta.client?.nombre || 'Cliente Genérico'}</td>
                                <td className="px-6 py-4">{venta.date}</td>
                                <td className="px-6 py-4 font-semibold">${venta.total.toFixed(2)}</td>
                                <td className="px-6 py-4 text-xs">{venta.receiptType}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[venta.status]}`}>
                                        {venta.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative" data-menu-id={venta.id}>
                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(venta.id === openMenuId ? null : venta.id)}} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <MoreVerticalIcon className="w-5 h-5" />
                                    </button>
                                    {openMenuId === venta.id && (
                                        <div ref={menuRef} className="absolute right-8 top-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700">
                                            <button onClick={() => handleAction('view', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><EyeIcon className="w-4 h-4 mr-2"/>Ver Detalle</button>
                                            <button onClick={() => handleAction('print', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><PrinterIcon className="w-4 h-4 mr-2"/>Reimprimir</button>
                                            {venta.status === SaleStatus.Completada &&
                                              <button onClick={() => handleAction('edit', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><PencilIcon className="w-4 h-4 mr-2"/>Editar Comp.</button>
                                            }
                                            <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                                            {venta.status === SaleStatus.Completada && (
                                                <>
                                                <button onClick={() => handleAction('return', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"><UndoIcon className="w-4 h-4 mr-2"/>Realizar Devolución</button>
                                                <button onClick={() => handleAction('cancel', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"><XIcon className="w-4 h-4 mr-2"/>Cancelar Venta</button>
                                                </>
                                            )}
                                            {(venta.status === SaleStatus.Cancelada || venta.status === SaleStatus.Devolución) &&
                                                <button onClick={() => handleAction('delete', venta)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"><Trash2Icon className="w-4 h-4 mr-2"/>Eliminar Registro</button>
                                            }
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDetailModalOpen && selectedVenta && (
                <SaleDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} venta={selectedVenta} />
            )}
            {isEditModalOpen && selectedVenta && (
                <EditSaleModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdit} ventaToEdit={selectedVenta} />
            )}
            {isConfirmModalOpen && selectedVenta && confirmActionType && (
                <ConfirmationModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={confirmAction}
                    title={`Confirmar ${confirmActionType === 'cancel' ? 'Cancelación' : confirmActionType === 'return' ? 'Devolución' : 'Eliminación'}`}
                    message={`¿Estás seguro de que deseas ${confirmActionType === 'delete' ? 'eliminar este registro' : confirmActionType} de la venta #${selectedVenta.receiptNumber}? Esta acción no se puede deshacer.`}
                />
            )}
        </div>
    );
};

export default POSSales;
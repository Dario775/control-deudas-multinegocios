import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Pago, PaymentStatus, PaymentMethod } from '../types';
import { SearchIcon, FilterIcon, PlusIcon, MoreVerticalIcon, CreditCardIcon, LandmarkIcon, BanknoteIcon, XIcon, EyeIcon, ReceiptTextIcon, WhatsappIcon, PhoneIcon, MailIcon } from '../components/icons';
import { mockPagos, mockClientes } from '../data/mockData';
import PaymentModal from '../components/modals/PaymentModal';
import NewPaymentModal from '../components/modals/NewPaymentModal';
import PaymentDetailModal from '../components/modals/PaymentDetailModal';

const statusColors: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Pagada]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PaymentStatus.Pendiente]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PaymentStatus.Vencida]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PaymentStatus.Cancelada]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const renderPaymentMethod = (method: PaymentMethod) => {
  let icon: React.ReactNode;
  let text: string = method;

  switch (method) {
    case PaymentMethod.Tarjeta:
      icon = <CreditCardIcon className="w-5 h-5 text-gray-400" />;
      text = 'Tarjeta';
      break;
    case PaymentMethod.Transferencia:
      icon = <LandmarkIcon className="w-5 h-5 text-gray-400" />;
      break;
    case PaymentMethod.Efectivo:
      icon = <BanknoteIcon className="w-5 h-5 text-gray-400" />;
      break;
  }

  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{text}</span>
    </div>
  );
};

const Pagos: React.FC = () => {
    const [pagos, setPagos] = useState<Pago[]>(mockPagos);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentToRegister, setPaymentToRegister] = useState<Pago | null>(null);
    const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [paymentForDetail, setPaymentForDetail] = useState<Pago | null>(null);

    const searchQuery = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status');
    const methodFilter = searchParams.get('method');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
             const target = event.target as HTMLElement;
            if (openMenuId && !target.closest(`[data-menu-id="${openMenuId}"]`)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const filteredPagos = useMemo(() => {
        let filtered = [...pagos];

        if (statusFilter) {
             const capitalizedStatus = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
             if (Object.values(PaymentStatus).includes(capitalizedStatus as PaymentStatus)) {
                filtered = filtered.filter(pago => pago.estado === capitalizedStatus);
             }
        }
        
        if (methodFilter) {
            if (Object.values(PaymentMethod).includes(methodFilter as PaymentMethod)) {
                filtered = filtered.filter(pago => pago.metodo === methodFilter);
            }
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(pago =>
                pago.cliente.nombre.toLowerCase().includes(lowercasedQuery) ||
                pago.cliente.email.toLowerCase().includes(lowercasedQuery)
            );
        }

        return filtered;
    }, [searchQuery, statusFilter, methodFilter, pagos]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (newQuery) {
            newParams.set('search', newQuery);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams, { replace: true });
    };
    
    const handleFilterChange = (type: 'status' | 'method', value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (newParams.get(type) === value) {
            newParams.delete(type);
        } else {
            newParams.set(type, value);
        }
        setSearchParams(newParams, { replace: true });
    };

    const clearFilters = () => {
        setSearchParams({}, { replace: true });
        setIsFilterOpen(false);
    };

    const handleMenuClick = (e: React.MouseEvent, pagoId: string) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === pagoId ? null : pagoId);
    };

    const handleOpenRegisterModal = (pago: Pago) => {
        setPaymentToRegister(pago);
        setIsPaymentModalOpen(true);
        setOpenMenuId(null);
    };
    
    const handleSavePayment = (updatedPayment: Pago) => {
        setPagos(prevPagos => 
            prevPagos.map(p => p.id === updatedPayment.id ? updatedPayment : p)
        );
        setIsPaymentModalOpen(false);
        setPaymentToRegister(null);
    };
    
    const handleSaveNewPayment = (paymentData: Omit<Pago, 'id' | 'estado' | 'fechaPago' | 'descripcion'> & { fechaPago: string, descripcion?: string }) => {
        const newPayment: Pago = {
            id: `pay-${Date.now()}`,
            cliente: paymentData.cliente,
            monto: paymentData.monto,
            metodo: paymentData.metodo,
            fechaPago: paymentData.fechaPago.split('-').reverse().join('/'),
            estado: PaymentStatus.Pagada,
            descripcion: paymentData.descripcion,
        };
        setPagos(prevPagos => [newPayment, ...prevPagos]);
        setIsNewPaymentModalOpen(false);
    };

    const handleViewDetail = (pago: Pago) => {
        setPaymentForDetail(pago);
        setIsDetailModalOpen(true);
        setOpenMenuId(null);
    };

    const handleViewReceipt = (pago: Pago) => {
        navigate(`/facturacion?search=${encodeURIComponent(pago.cliente.nombre)}`);
        setOpenMenuId(null);
    };

    const isAnyFilterActive = !!(searchQuery || statusFilter || methodFilter);
    
    const getPageTitle = () => {
        if (!statusFilter) return "Pagos y Facturas";
        switch(statusFilter.toLowerCase()) {
            case 'pagada': return "Pagos Realizados";
            case 'vencida': return "Pagos Vencidos";
            case 'pendiente': return "Pagos Pendientes";
            case 'cancelada': return "Pagos Cancelados";
            default: return "Pagos y Facturas";
        }
    }

    const ActionMenu: React.FC<{ pago: Pago }> = ({ pago }) => (
        <div 
            onClick={e => e.stopPropagation()}
            className="absolute right-8 top-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700"
        >
            <button 
                onClick={() => handleViewDetail(pago)}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <EyeIcon className="w-4 h-4 mr-3" /> Ver Detalle del Pago
            </button>

            {pago.estado === PaymentStatus.Pagada && (
                <button 
                    onClick={() => handleViewReceipt(pago)}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ReceiptTextIcon className="w-4 h-4 mr-3" /> Ver Comprobante
                </button>
            )}

            {[PaymentStatus.Pendiente, PaymentStatus.Vencida].includes(pago.estado) && (
                 <button 
                    onClick={() => handleOpenRegisterModal(pago)}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                 >
                    <CreditCardIcon className="w-4 h-4 mr-3" /> Registrar Pago
                </button>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{getPageTitle()}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Consulta el historial de pagos y gestiona facturas.</p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Buscar por cliente..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="relative" ref={filterRef}>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                                isAnyFilterActive
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600'
                            }`}
                        >
                            <FilterIcon className="w-5 h-5 mr-2" />
                            Filtros
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border dark:border-gray-700 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold">Filtrar por</h4>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Pago</label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {Object.values(PaymentStatus).map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => handleFilterChange('status', value)}
                                                    className={`px-2 py-1 text-sm rounded-md transition-colors ${
                                                        statusFilter === value
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</label>
                                        <div className="flex flex-col space-y-2 mt-2">
                                            {Object.values(PaymentMethod).map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => handleFilterChange('method', value)}
                                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors text-left ${
                                                        methodFilter === value
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {isAnyFilterActive && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <button onClick={clearFilters} className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                            Limpiar todos los filtros
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsNewPaymentModalOpen(true)}
                        className="hidden sm:flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Registrar Pago
                    </button>
                </div>
            </div>

            {filteredPagos.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="px-6 py-3">Cliente</th>
                        <th scope="col" className="px-6 py-3">Monto</th>
                        <th scope="col" className="px-6 py-3">Fecha de Pago</th>
                        <th scope="col" className="px-6 py-3">Método</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPagos.map((pago) => {
                             const clienteCompleto = mockClientes.find(c => c.id === pago.cliente.id);
                            return (
                                <tr key={pago.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{pago.cliente.nombre}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{pago.cliente.email}</div>
                                        {pago.estado !== PaymentStatus.Pagada && clienteCompleto && (
                                            <div className="flex items-center space-x-2 mt-2">
                                                <a href={`https://wa.me/${clienteCompleto.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="Contactar por WhatsApp" className="text-gray-400 hover:text-green-500">
                                                    <WhatsappIcon className="w-5 h-5" />
                                                </a>
                                                <a href={`tel:${clienteCompleto.telefono}`} title="Llamar por teléfono" className="text-gray-400 hover:text-indigo-500">
                                                    <PhoneIcon className="w-5 h-5" />
                                                </a>
                                                <a href={`mailto:${clienteCompleto.email}`} title="Enviar Email" className="text-gray-400 hover:text-indigo-500">
                                                    <MailIcon className="w-5 h-5" />
                                                </a>
                                            </div>
                                        )}
                                        {pago.descripcion && (
                                            <div className="text-xs text-gray-400 italic mt-1 max-w-xs truncate" title={pago.descripcion}>
                                                {pago.descripcion}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium">${pago.monto.toFixed(2)}</td>
                                    <td className="px-6 py-4">{pago.fechaPago}</td>
                                    <td className="px-6 py-4">
                                    {renderPaymentMethod(pago.metodo)}
                                    </td>
                                    <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[pago.estado]}`}>
                                        {pago.estado}
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative" data-menu-id={pago.id}>
                                        <button 
                                            onClick={(e) => handleMenuClick(e, pago.id)} 
                                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <MoreVerticalIcon className="w-5 h-5" />
                                        </button>
                                        {openMenuId === pago.id && <ActionMenu pago={pago} />}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron pagos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
                </div>
            )}
            <NewPaymentModal
                isOpen={isNewPaymentModalOpen}
                onClose={() => setIsNewPaymentModalOpen(false)}
                onSave={handleSaveNewPayment}
            />
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSave={handleSavePayment}
                payment={paymentToRegister}
             />
             <PaymentDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                payment={paymentForDetail}
            />
        </div>
    );
};

export default Pagos;
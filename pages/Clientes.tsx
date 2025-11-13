import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cliente, ClientStatus } from '../types';
import { SearchIcon, FilterIcon, PlusIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon, WhatsappIcon, PhoneIcon, MailIcon, UserIcon, PencilIcon, XIcon } from '../components/icons';
import { mockClientes } from '../data/mockData';
import CustomerCard from '../components/CustomerCard';
import CustomerModal from '../components/modals/CustomerModal';

export const statusColors: { [key in ClientStatus]: string } = {
  [ClientStatus.Activo]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ClientStatus.Inactivo]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [ClientStatus.Moroso]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const ITEMS_PER_PAGE = 10;

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Cliente | null>(null);
  const [isViewMode, setIsViewMode] = useState(false); // New state for view mode

  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status');

  useEffect(() => {
    // Reset to first page on new search or filter
    setCurrentPage(1); 
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (openMenuId && !target.closest(`[data-menu-id="${openMenuId}"]`)) {
            setOpenMenuId(null);
        }
        if (filterRef.current && !filterRef.current.contains(target)) {
            setIsFilterOpen(false);
        }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
        document.removeEventListener('click', handleOutsideClick);
    };
  }, [openMenuId]);


  const filteredClientes = useMemo(() => {
    let filtered = [...clientes];

    if (statusFilter) {
        if (Object.values(ClientStatus).includes(statusFilter as ClientStatus)) {
            filtered = filtered.filter(cliente => cliente.estado === statusFilter);
        }
    }

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(cliente =>
            cliente.nombre.toLowerCase().includes(lowercasedQuery) ||
            cliente.email.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    return filtered;
  }, [searchQuery, statusFilter, clientes]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClientes = filteredClientes.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const handleMenuClick = (e: React.MouseEvent, clienteId: string) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === clienteId ? null : clienteId);
  }
  
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

  const handleFilterChange = (type: 'status', value: string) => {
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
  
  // Specific handler for viewing a profile in read-only mode
  const handleViewProfile = (customer: Cliente) => {
    setIsViewMode(true);
    setCustomerToEdit(customer);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // Handler for creating a new customer or editing an existing one
  const handleOpenModal = (customer?: Cliente) => {
    setIsViewMode(false);
    setCustomerToEdit(customer || null);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setCustomerToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveCustomer = (customerData: Cliente) => {
    const customerExists = clientes.some(c => c.id === customerData.id);
    if (customerExists) {
        setClientes(prev => prev.map(c => c.id === customerData.id ? customerData : c));
    } else {
        setClientes(prev => [customerData, ...prev]);
    }
    handleCloseModal();
  };


  const isAnyFilterActive = !!(searchQuery || statusFilter);

  const ActionMenu: React.FC<{ cliente: Cliente }> = ({ cliente }) => (
    <div 
        onClick={e => e.stopPropagation()}
        className="absolute right-8 top-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700"
    >
        <button onClick={() => handleViewProfile(cliente)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <UserIcon className="w-4 h-4 mr-3" /> Ver Perfil de Cliente
        </button>
         <button onClick={() => handleOpenModal(cliente)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <PencilIcon className="w-4 h-4 mr-3" /> Editar Datos
        </button>
        <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <a 
            href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <WhatsappIcon className="w-4 h-4 mr-3 text-green-500" /> Contactar por WhatsApp
        </a>
        <a 
            href={`tel:${cliente.telefono}`}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <PhoneIcon className="w-4 h-4 mr-3" /> Llamar por teléfono
        </a>
        <a 
            href={`mailto:${cliente.email}`}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <MailIcon className="w-4 h-4 mr-3" /> Enviar Email
        </a>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Clientes</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Administra la información y estado de tus clientes.</p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
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
                 <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Filtrar por Estado</h4>
                        <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                     <div className="flex flex-col space-y-2">
                        {Object.values(ClientStatus).map((value) => (
                            <button
                                key={value}
                                onClick={() => handleFilterChange('status', value)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors text-left ${
                                    statusFilter === value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {value}
                            </button>
                        ))}
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
          <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>
      
      {/* Table View for Desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Contacto</th>
              <th scope="col" className="px-6 py-3">Plan Actual</th>
              <th scope="col" className="px-6 py-3">Fecha de Registro</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {currentClientes.length > 0 ? (
              currentClientes.map((cliente) => (
              <tr key={cliente.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {cliente.nombre}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <a href={`mailto:${cliente.email}`} title={cliente.email} className="text-gray-400 hover:text-indigo-500"><MailIcon className="w-5 h-5"/></a>
                    <a href={`tel:${cliente.telefono}`} title={cliente.telefono} className="text-gray-400 hover:text-indigo-500"><PhoneIcon className="w-5 h-5"/></a>
                    <a href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="Contactar por WhatsApp" className="text-gray-400 hover:text-green-500"><WhatsappIcon className="w-5 h-5"/></a>
                  </div>
                </td>
                <td className="px-6 py-4">{cliente.plan.nombre}</td>
                <td className="px-6 py-4">{cliente.fechaRegistro}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[cliente.estado]}`}>
                    {cliente.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative" data-menu-id={cliente.id}>
                    <button onClick={(e) => handleMenuClick(e, cliente.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <MoreVerticalIcon className="w-5 h-5" />
                    </button>
                    {openMenuId === cliente.id && <ActionMenu cliente={cliente} />}
                </td>
              </tr>
            ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No se encontraron clientes que coincidan con la búsqueda.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards View for Mobile/Tablet */}
      <div className="block lg:hidden">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentClientes.length > 0 ? (
                 currentClientes.map((cliente) => (
                    <CustomerCard 
                        key={cliente.id}
                        cliente={cliente}
                        openMenuId={openMenuId}
                        onMenuClick={handleMenuClick}
                    >
                        <ActionMenu cliente={cliente} />
                    </CustomerCard>
                ))
            ) : (
                <div className="sm:col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                    No se encontraron clientes.
                </div>
            )}
        </div>
      </div>


       <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          Mostrando {filteredClientes.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length} clientes
        </span>
        <div className="flex items-center space-x-2">
            <button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1 || totalPages === 0}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="font-medium">Página {totalPages > 0 ? currentPage : 0} de {totalPages}</span>
             <button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
        isReadOnly={isViewMode}
      />
    </div>
  );
};

export default Clientes;
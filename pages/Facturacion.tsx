import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Factura, InvoiceStatus } from '../types';
import { SearchIcon, FilterIcon, PlusIcon, MoreVerticalIcon, EyeIcon, PencilIcon, Trash2Icon, DownloadIcon, WhatsappIcon, PhoneIcon, MailIcon } from '../components/icons';
import { mockFacturas, mockClientes } from '../data/mockData';
import FacturaViewModal from '../components/modals/FacturaViewModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const statusColors: { [key in InvoiceStatus]: string } = {
  [InvoiceStatus.Pagada]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [InvoiceStatus.Enviada]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [InvoiceStatus.Borrador]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [InvoiceStatus.Vencida]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [InvoiceStatus.Anulada]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const Facturacion: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [facturas, setFacturas] = useState(mockFacturas);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [facturaToDelete, setFacturaToDelete] = useState<Factura | null>(null);

    const filteredFacturas = useMemo(() => {
        if (!searchQuery) return facturas;
        const lowercasedQuery = searchQuery.toLowerCase();
        return facturas.filter(factura => 
            factura.numero.toLowerCase().includes(lowercasedQuery) ||
            factura.cliente.nombre.toLowerCase().includes(lowercasedQuery)
        );
    }, [facturas, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        const newParams = new URLSearchParams(searchParams);
        if (query) {
            newParams.set('search', query);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams, { replace: true });
    };

    const handleToggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };
    
    const handleView = (factura: Factura) => {
        setSelectedFactura(factura);
        setIsViewModalOpen(true);
        setOpenMenuId(null);
    };

    const handleEdit = (id: string) => {
        navigate(`/facturacion/editar/${id}`);
        setOpenMenuId(null);
    };

    const handleDownload = (id: string) => {
        window.open(`/#/factura/print/${id}`, '_blank');
        setOpenMenuId(null);
    };

    const handleDelete = (factura: Factura) => {
        setFacturaToDelete(factura);
        setIsConfirmDeleteOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (facturaToDelete) {
            setFacturas(currentFacturas => currentFacturas.filter(f => f.id !== facturaToDelete.id));
        }
        setIsConfirmDeleteOpen(false);
        setFacturaToDelete(null);
    };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Facturación</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Crea y gestiona tus comprobantes y facturas.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por Nº o cliente..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
            <FilterIcon className="w-5 h-5 mr-2" />
            Filtros
          </button>
          <button onClick={() => navigate('/facturacion/nuevo')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Comprobante
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nº Factura</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Fecha Emisión</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.map((factura) => {
              const clienteCompleto = mockClientes.find(c => c.id === factura.cliente.id);
              return (
                <tr key={factura.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{factura.numero}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{factura.cliente.nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{factura.cliente.email}</div>
                     {factura.estado !== InvoiceStatus.Pagada && clienteCompleto && (
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
                  </td>
                  <td className="px-6 py-4">{factura.fechaEmision}</td>
                  <td className="px-6 py-4 font-medium">${factura.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[factura.estado]}`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                      <button onClick={(e) => handleToggleMenu(e, factura.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreVerticalIcon className="w-5 h-5" />
                      </button>
                      {openMenuId === factura.id && (
                          <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                              <button onClick={() => handleView(factura)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <EyeIcon className="w-4 h-4 mr-2" /> Ver
                              </button>
                              <button onClick={() => handleEdit(factura.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <PencilIcon className="w-4 h-4 mr-2" /> Editar
                              </button>
                              <button onClick={() => handleDownload(factura.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <DownloadIcon className="w-4 h-4 mr-2" /> Descargar PDF
                              </button>
                              <button onClick={() => handleDelete(factura)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <Trash2Icon className="w-4 h-4 mr-2" /> Eliminar
                              </button>
                          </div>
                      )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {selectedFactura && (
          <FacturaViewModal 
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
              factura={selectedFactura}
          />
      )}

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Eliminar Factura #${facturaToDelete?.numero ?? ''}`}
        message="¿Estás seguro de que quieres eliminar esta factura? Esta acción es permanente y no se puede deshacer."
      />
    </div>
  );
};

export default Facturacion;
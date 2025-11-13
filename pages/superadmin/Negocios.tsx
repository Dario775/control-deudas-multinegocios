import React, { useState, useMemo } from 'react';
import { Negocio, SuscripcionStatus, Servicio } from '../../types';
import { mockNegocios } from '../../data/mockData';
import { SearchIcon, PlusIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from '../../components/icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
// Modal para crear/editar negocios se creará en un siguiente paso.
// import NegocioModal from '../../components/modals/NegocioModal';

const statusColors: { [key in SuscripcionStatus]: string } = {
  [SuscripcionStatus.Activa]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [SuscripcionStatus.Inactiva]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const serviceLabels: { [key in Servicio]: string } = {
    fidelizacion: 'Fidelización',
    pos: 'Punto de Venta (POS)',
};

const Negocios: React.FC = () => {
    const [negocios, setNegocios] = useState<Negocio[]>(mockNegocios);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Placeholder states for modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [negocioToEdit, setNegocioToEdit] = useState<Negocio | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [negocioToDelete, setNegocioToDelete] = useState<Negocio | null>(null);

    const filteredNegocios = useMemo(() => {
        return negocios.filter(negocio =>
            negocio.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            negocio.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [negocios, searchQuery]);
    
    const handleToggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };
    
    const handleOpenModal = (negocio?: Negocio) => {
        alert("La funcionalidad de crear/editar negocios aún no está implementada.");
        // setNegocioToEdit(negocio || null);
        // setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDelete = (negocio: Negocio) => {
        setNegocioToDelete(negocio);
        setIsConfirmOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (negocioToDelete) {
            setNegocios(current => current.filter(n => n.id !== negocioToDelete.id));
        }
        setIsConfirmOpen(false);
        setNegocioToDelete(null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Negocios</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Administra tus clientes, sus suscripciones y servicios.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nuevo Negocio
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre del Negocio</th>
                            <th scope="col" className="px-6 py-3">Contacto</th>
                            <th scope="col" className="px-6 py-3">Estado Suscripción</th>
                            <th scope="col" className="px-6 py-3">Servicios Activos</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNegocios.map((negocio) => (
                            <tr key={negocio.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {negocio.nombre}
                                    <span className="block text-xs font-normal text-gray-500">Registrado: {negocio.fechaRegistro}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {negocio.email}
                                    <span className="block text-xs text-gray-500">{negocio.telefono}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[negocio.estadoSuscripcion]}`}>
                                        {negocio.estadoSuscripcion}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {negocio.serviciosActivos.map(servicio => (
                                            <span key={servicio} className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                {serviceLabels[servicio]}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button onClick={(e) => handleToggleMenu(e, negocio.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <MoreVerticalIcon className="w-5 h-5" />
                                    </button>
                                    {openMenuId === negocio.id && (
                                        <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                                            <button onClick={() => handleOpenModal(negocio)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <PencilIcon className="w-4 h-4 mr-2" /> Editar
                                            </button>
                                            <button onClick={() => handleDelete(negocio)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Trash2Icon className="w-4 h-4 mr-2" /> Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Modal de confirmación de eliminación */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={`Eliminar Negocio "${negocioToDelete?.nombre ?? ''}"`}
                message="¿Estás seguro de que quieres eliminar este negocio? Toda la información asociada (clientes, pagos, etc.) será eliminada permanentemente. Esta acción no se puede deshacer."
            />

            {/* A futuro, se implementará el modal de edición/creación
            <NegocioModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => console.log('Saving', data)}
                negocioToEdit={negocioToEdit}
            />
            */}
        </div>
    );
};

export default Negocios;

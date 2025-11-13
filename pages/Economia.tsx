import React, { useState, useMemo, useEffect } from 'react';
import { Gasto, ExpenseCategory } from '../types';
import { mockGastos } from '../data/mockData';
import Card from '../components/ui/Card';
import { DollarSignIcon, SearchIcon, FilterIcon, PlusIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from '../components/icons';
import ExpenseModal from '../components/modals/ExpenseModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const categoryColors: { [key in ExpenseCategory]: string } = {
  [ExpenseCategory.Sueldos]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ExpenseCategory.Servicios]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  [ExpenseCategory.Alquiler]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [ExpenseCategory.Suministros]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [ExpenseCategory.Marketing]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  [ExpenseCategory.Operativos]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [ExpenseCategory.Eventuales]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ExpenseCategory.Compras]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const Economia: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>(mockGastos);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoToEdit, setGastoToEdit] = useState<Gasto | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState<Gasto | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (openMenuId && !target.closest(`[data-menu-id="${openMenuId}"]`)) {
            setOpenMenuId(null);
        }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
        document.removeEventListener('click', handleOutsideClick);
    };
  }, [openMenuId]);

  const filteredGastos = useMemo(() => {
    return gastos
      .filter(gasto =>
        gasto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(gasto =>
        categoryFilter ? gasto.categoria === categoryFilter : true
      )
      .sort((a, b) => new Date(b.fecha.split('/').reverse().join('-')).getTime() - new Date(a.fecha.split('/').reverse().join('-')).getTime());
  }, [gastos, searchQuery, categoryFilter]);

  const summaryData = useMemo(() => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyExpenses = gastos.reduce((total, gasto) => {
          const [day, month, year] = gasto.fecha.split('/').map(Number);
          if (month - 1 === currentMonth && year === currentYear) {
              return total + gasto.monto;
          }
          return total;
      }, 0);
      
      // Assuming a mock monthly income for balance calculation
      const monthlyIncome = 12540;
      const netBalance = monthlyIncome - monthlyExpenses;

      return { monthlyExpenses, netBalance };

  }, [gastos]);

  const handleOpenModal = (gasto?: Gasto) => {
    setGastoToEdit(gasto || null);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };
  
  const handleCloseModal = () => {
    setGastoToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveGasto = (gastoData: Gasto) => {
    setGastos(prev => {
      const exists = prev.some(g => g.id === gastoData.id);
      if (exists) {
        return prev.map(g => g.id === gastoData.id ? gastoData : g);
      }
      return [gastoData, ...prev];
    });
    handleCloseModal();
  };
  
  const handleDeleteGasto = (gasto: Gasto) => {
    setGastoToDelete(gasto);
    setIsConfirmOpen(true);
    setOpenMenuId(null);
  };
  
  const confirmDelete = () => {
    if (gastoToDelete) {
      setGastos(prev => prev.filter(g => g.id !== gastoToDelete.id));
    }
    setIsConfirmOpen(false);
    setGastoToDelete(null);
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const ActionMenu: React.FC<{ gasto: Gasto }> = ({ gasto }) => (
    <div 
        onClick={e => e.stopPropagation()}
        className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700"
    >
        <button onClick={() => handleOpenModal(gasto)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <PencilIcon className="w-4 h-4 mr-2" /> Editar
        </button>
        <button onClick={() => handleDeleteGasto(gasto)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Trash2Icon className="w-4 h-4 mr-2" /> Eliminar
        </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Economía del Negocio</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Registra y controla todos los gastos de tu negocio.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card 
          title="Gastos Totales (Mes)"
          value={`$${summaryData.monthlyExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSignIcon className="w-6 h-6" />}
        />
         <Card 
          title="Balance Neto (Mes)"
          value={`$${summaryData.netBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          changeType={summaryData.netBalance >= 0 ? 'positive' : 'negative'}
          change={`${summaryData.netBalance >= 0 ? 'Ganancia' : 'Pérdida'}`}
          icon={<DollarSignIcon className="w-6 h-6" />}
        />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Gastos por Categoría (Mes)</h3>
            {/* Simple display, a chart could be used here */}
            <div className="text-xs space-y-1">
                <p><strong>Sueldos:</strong> $5,500.00</p>
                <p><strong>Servicios:</strong> $270.75</p>
                <p><strong>Alquiler:</strong> $1,200.00</p>
            </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold">Historial de Gastos</h3>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input type="text" placeholder="Buscar por descripción..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full" />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <PlusIcon className="w-5 h-5 mr-2" />
              Registrar Gasto
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Descripción</th>
                <th scope="col" className="px-6 py-3">Monto</th>
                <th scope="col" className="px-6 py-3">Fecha</th>
                <th scope="col" className="px-6 py-3">Categoría</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredGastos.map(gasto => (
                <tr key={gasto.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{gasto.descripcion}</td>
                  <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400">-${gasto.monto.toFixed(2)}</td>
                  <td className="px-6 py-4">{gasto.fecha}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[gasto.categoria]}`}>
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative" data-menu-id={gasto.id}>
                    <button onClick={(e) => handleMenuClick(e, gasto.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <MoreVerticalIcon className="w-5 h-5" />
                    </button>
                    {openMenuId === gasto.id && <ActionMenu gasto={gasto} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGasto}
        expenseToEdit={gastoToEdit}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Eliminar Gasto`}
        message={`¿Estás seguro de que quieres eliminar el registro "${gastoToDelete?.descripcion || ''}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default Economia;
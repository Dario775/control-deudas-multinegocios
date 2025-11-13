import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, PackageIcon, SettingsIcon, ShoppingCartIcon, BarcodeIcon, BoxesIcon, BarChart3Icon, ReceiptTextIcon } from '../../icons';

const navItems = [
  { to: '/pos/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/pos/sale', label: 'Punto de Venta', Icon: ShoppingCartIcon },
  { to: '/pos/sales', label: 'Ventas', Icon: ReceiptTextIcon },
  { to: '/pos/products', label: 'Productos', Icon: BarcodeIcon },
  { to: '/pos/customers', label: 'Clientes', Icon: UsersIcon },
  { to: '/pos/stock', label: 'Stock', Icon: BoxesIcon },
  { to: '/pos/reports', label: 'Reportes', Icon: BarChart3Icon },
  { to: '/pos/settings', label: 'Configuración', Icon: SettingsIcon },
];

const POSSidebar: React.FC = () => {
  const activeLinkClass = 'bg-indigo-600 text-white';
  const inactiveLinkClass = 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700';

  const renderNavLink = (item: { to: string; label: string; Icon: React.ElementType }) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive ? activeLinkClass : inactiveLinkClass
          }`
        }
      >
        <item.Icon className="w-5 h-5" />
        <span className="ml-3">{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Sistema POS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul>{navItems.map(renderNavLink)}</ul>
      </nav>
    </aside>
  );
};

export default POSSidebar;
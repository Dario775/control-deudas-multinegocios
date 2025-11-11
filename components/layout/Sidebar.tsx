import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, PackageIcon, CreditCardIcon, SettingsIcon, FileTextIcon } from '../icons';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/clientes', label: 'Clientes', Icon: UsersIcon },
  { to: '/planes', label: 'Planes y Servicios', Icon: PackageIcon },
  { to: '/pagos', label: 'Pagos y Facturas', Icon: CreditCardIcon },
  { to: '/facturacion', label: 'Facturación', Icon: FileTextIcon },
  { to: '/configuracion', label: 'Configuración', Icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const activeLinkClass = 'bg-indigo-600 text-white';
  const inactiveLinkClass = 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700';

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Gestor</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? activeLinkClass : inactiveLinkClass
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
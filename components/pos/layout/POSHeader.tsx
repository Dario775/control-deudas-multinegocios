import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { SunIcon, MoonIcon, LogOutIcon, ChevronDown, Grid3x3Icon, UsersIcon } from '../../icons';
import { POSUser } from '../../../types';

interface POSHeaderProps {
    user: POSUser;
    onLogout: () => void;
}

const POSHeader: React.FC<POSHeaderProps> = ({ user, onLogout }) => {
    const { theme, setTheme } = useTheme();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const appSwitcherRef = useRef<HTMLDivElement>(null);


    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
             if (appSwitcherRef.current && !appSwitcherRef.current.contains(event.target as Node)) {
                setIsAppSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6 flex-shrink-0">
             <div className="relative mr-4" ref={appSwitcherRef}>
                <button
                    onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Cambiar de aplicación"
                >
                    <Grid3x3Icon className="w-6 h-6" />
                </button>
                {isAppSwitcherOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Aplicaciones</div>
                    <a href="#/login" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UsersIcon className="w-5 h-5 mr-3 text-indigo-500" />
                        <div>
                        <p className="font-semibold">Panel de Gestión</p>
                        <p className="text-xs text-gray-500">Administración de clientes y suscripciones.</p>
                        </div>
                    </a>
                    </div>
                )}
            </div>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>

            <div className="relative ml-4" ref={profileDropdownRef}>
                <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                >
                    <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={`https://i.pravatar.cc/150?u=${user.id}`}
                        alt="Foto de perfil"
                    />
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.nombre}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role === 'pos-manager' ? 'Manager' : 'Cajero'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </button>
                {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                        <a
                            href="#/pos/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Mi Cuenta
                        </a>
                        <button
                            onClick={onLogout}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOutIcon className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default POSHeader;
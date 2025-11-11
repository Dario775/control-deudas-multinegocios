import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '../icons';

const PublicHeader: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-40 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    <NavLink to="/">Gestor</NavLink>
                </h1>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#planes" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Planes</a>
                    <a href="#testimonios" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Testimonios</a>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Contacto</a>
                </nav>
                <div className="flex items-center space-x-4">
                     <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    >
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                    <NavLink
                        to="/login"
                        className="hidden sm:block px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Iniciar Sesión
                    </NavLink>
                    <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Registrarse
                    </a>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;

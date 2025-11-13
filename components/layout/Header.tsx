import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, LogOutIcon, ChevronDown, BellIcon, Grid3x3Icon, ShoppingCartIcon } from '../icons';
import { useNavigate } from 'react-router-dom';
import { Notificacion } from '../../types';
import NotificationDropdown from '../notifications/NotificationDropdown';

type UserRole = 'super-admin' | 'admin' | 'customer';

interface HeaderProps {
    onLogout: () => void;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    notifications: Notificacion[];
    setNotifications: React.Dispatch<React.SetStateAction<Notificacion[]>>;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userRole, setUserRole, notifications, setNotifications }) => {
  const { theme, setTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const appSwitcherRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    setIsNotifDropdownOpen(false); // Close dropdown on click
  };
  
  const getProfileInfo = () => {
      switch(userRole) {
          case 'super-admin':
              return { name: 'Super Admin', profileLink: '#/super/dashboard' };
          case 'admin':
              return { name: 'Admin Negocio', profileLink: '#/configuracion' };
          case 'customer':
              return { name: 'Maria García', profileLink: '#/portal/datos' };
      }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
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

  const profileInfo = getProfileInfo();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6">
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
            <a href="#/pos/login" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ShoppingCartIcon className="w-5 h-5 mr-3 text-indigo-500" />
              <div>
                <p className="font-semibold">Terminal POS</p>
                <p className="text-xs text-gray-500">Punto de Venta para facturación rápida.</p>
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

      <div className="relative ml-4" ref={notifDropdownRef}>
        <button onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative">
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>}
        </button>
        {isNotifDropdownOpen && (
            <NotificationDropdown 
                notifications={notifications} 
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkAsRead={handleMarkAsRead}
            />
        )}
      </div>

      <div className="relative ml-4" ref={profileDropdownRef}>
        <button
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="https://picsum.photos/100"
            alt="Tu foto de perfil"
          />
          <span className="hidden md:inline text-sm font-medium">
            {profileInfo.name}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {isProfileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
            <a
              href={profileInfo.profileLink}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Mi Perfil
            </a>
            <button
              onClick={handleLogout}
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

export default Header;
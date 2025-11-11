import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, LogOutIcon, ChevronDown, BellIcon } from '../icons';
import { useNavigate } from 'react-router-dom';
import { Notificacion } from '../../types';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface HeaderProps {
    onLogout: () => void;
    userRole: 'admin' | 'customer';
    setUserRole: (role: 'admin' | 'customer') => void;
    notifications: Notificacion[];
    setNotifications: React.Dispatch<React.SetStateAction<Notificacion[]>>;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userRole, setUserRole, notifications, setNotifications }) => {
  const { theme, setTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'admin' | 'customer';
    setUserRole(newRole);
    if (newRole === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/portal/dashboard');
    }
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


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6">
      <div className="flex items-center space-x-2 mr-4 text-sm">
        <label htmlFor="view-switcher" className="font-medium text-gray-700 dark:text-gray-300">Vista:</label>
        <select 
          id="view-switcher"
          value={userRole} 
          onChange={handleRoleChange}
          className="rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:ring-0 text-sm"
        >
          <option value="admin">Admin</option>
          <option value="customer">Cliente</option>
        </select>
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
            {userRole === 'admin' ? 'Admin Negocio' : 'Maria García'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {isProfileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
            <a
              href={userRole === 'admin' ? "#/configuracion" : "#/portal/datos"}
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
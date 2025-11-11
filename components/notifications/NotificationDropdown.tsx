import React from 'react';
import { Link } from 'react-router-dom';
import { Notificacion, NotificationType } from '../../types';
import { mockClientes } from '../../data/mockData';
import { CreditCardIcon, FileTextIcon } from '../icons';

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    switch (type) {
        case NotificationType.VencimientoProximo:
            return <CreditCardIcon className="w-5 h-5 text-yellow-500" />;
        case NotificationType.PagoVencido:
            return <CreditCardIcon className="w-5 h-5 text-red-500" />;
        case NotificationType.NuevoPago:
            return <FileTextIcon className="w-5 h-5 text-green-500" />;
        default:
            return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
}

interface NotificationDropdownProps {
    notifications: Notificacion[];
    onMarkAllAsRead: () => void;
    onMarkAsRead: (notificationId: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAllAsRead, onMarkAsRead }) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold">Notificaciones</h3>
                {unreadCount > 0 && (
                    <button onClick={onMarkAllAsRead} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        Marcar todo como leído
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No hay notificaciones.</p>
                ) : (
                    notifications.map(notif => {
                        const customer = mockClientes.find(c => c.id === notif.customerId);
                        const linkTo = customer ? `/clientes?search=${encodeURIComponent(customer.nombre)}` : '/clientes';
                        
                        return (
                           <Link
                             key={notif.id}
                             to={linkTo}
                             className={`block hover:bg-gray-50 dark:hover:bg-gray-700 ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                             onClick={() => onMarkAsRead(notif.id)}
                           >
                             <div className="flex items-start p-4 border-b dark:border-gray-700 last:border-b-0">
                               <div className="flex-shrink-0 mt-1">
                                 <NotificationIcon type={notif.type} />
                               </div>
                               <div className="ml-3 w-0 flex-1">
                                 <p className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                   {notif.type}
                                 </p>
                                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notif.message}</p>
                                 <p className="mt-1 text-xs text-gray-400">{notif.date}</p>
                               </div>
                             </div>
                           </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
import React, { createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import POSHeader from './POSHeader';
import POSSidebar from './POSSidebar';
import { POSUser } from '../../../types';

interface POSLayoutProps {
    user: POSUser;
    onLogout: () => void;
}

const POSUserContext = createContext<POSUser | null>(null);
export const usePOSUser = () => useContext(POSUserContext);

const POSLayout: React.FC<POSLayoutProps> = ({ user, onLogout }) => {
    const location = useLocation();
    const isSalePage = location.pathname.endsWith('/sale');

    return (
        <POSUserContext.Provider value={user}>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {!isSalePage && <POSSidebar />}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {!isSalePage && <POSHeader user={user} onLogout={onLogout} />}
                    <main className={`flex-1 overflow-hidden ${isSalePage ? '' : 'overflow-y-auto bg-gray-100 dark:bg-gray-900'}`}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </POSUserContext.Provider>
    );
};

export default POSLayout;

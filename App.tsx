
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Sidebar from './components/layout/Sidebar';
import SuperAdminSidebar from './components/layout/SuperAdminSidebar';
import CustomerSidebar from './components/layout/CustomerSidebar';
import Header from './components/layout/Header';
import PublicHeader from './components/layout/PublicHeader';
import PublicFooter from './components/layout/PublicFooter';
import POSLayout from './components/pos/layout/POSLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Planes from './pages/Planes';
import Pagos from './pages/Pagos';
import Facturacion from './pages/Facturacion';
import FacturaEditor from './pages/FacturaEditor';
import FacturaPrint from './pages/FacturaPrint';
import Configuracion from './pages/Configuracion';
import Economia from './pages/Economia';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerDatos from './pages/customer/Datos';
import CustomerPagos from './pages/customer/Pagos';
import CustomerSuscripcion from './pages/customer/Suscripcion';
import CustomerContacto from './pages/customer/Contacto';

// Super Admin Pages
import SuperDashboard from './pages/superadmin/SuperDashboard';
import Negocios from './pages/superadmin/Negocios';

// POS Pages
import POSLogin from './pages/pos/POSLogin';
import POSDashboard from './pages/pos/POSDashboard';
import Sale from './pages/pos/Sale';
import Productos from './pages/pos/Productos';
import POSClientes from './pages/pos/POSClientes';
import POSStock from './pages/pos/POSStock';
import POSSettings from './pages/pos/POSSettings';
import POSReports from './pages/pos/POSReports';
import POSSales from './pages/pos/POSSales';
import POSReceiptPrint from './pages/pos/POSReceiptPrint';


// Hooks & Types
import { ThemeContext, Theme } from './hooks/useTheme';
import { Notificacion, POSUser } from './types';
import { mockNotificaciones } from './data/mockData';

type UserRole = 'super-admin' | 'admin' | 'customer';

const ProtectedLayout: React.FC<{
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
  notifications: Notificacion[];
  setNotifications: React.Dispatch<React.SetStateAction<Notificacion[]>>;
}> = ({ userRole, setUserRole, onLogout, notifications, setNotifications }) => {
    const renderSidebar = () => {
        switch (userRole) {
            case 'super-admin':
                return <SuperAdminSidebar />;
            case 'admin':
                return <Sidebar />;
            case 'customer':
                return <CustomerSidebar />;
            default:
                return null;
        }
    }
  
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {renderSidebar()}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onLogout={onLogout} 
            userRole={userRole}
            setUserRole={setUserRole}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
};

const PublicLayout: React.FC = () => (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <PublicHeader />
        <main className="flex-grow">
            <Outlet />
        </main>
        <PublicFooter />
    </div>
);


const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    }
    return 'light';
  });

  // State for Management App
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [notifications, setNotifications] = useState<Notificacion[]>(mockNotificaciones);

  // State for POS App
  const [posUser, setPosUser] = useState<POSUser | null>(null);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  // Handlers for Management App
  const handleLogin = (role: UserRole) => {
      setUserRole(role);
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      window.location.hash = '/login';
  };

  // Handlers for POS App
  const handlePosLogin = (user: POSUser) => {
    setPosUser(user);
  };

  const handlePosLogout = () => {
    setPosUser(null);
    window.location.hash = '/pos/login';
  };


  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // This component dynamically selects the correct layout for the Management App.
  const ManagementLayout = () => {
    return isAuthenticated 
      ? <ProtectedLayout userRole={userRole} setUserRole={setUserRole} onLogout={handleLogout} notifications={notifications} setNotifications={setNotifications} /> 
      : <PublicLayout />;
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <HashRouter>
        <Routes>
          {/* --- POS Routes (Highest Priority) --- */}
          <Route path="/pos/login" element={!posUser ? <POSLogin onLogin={handlePosLogin} /> : <Navigate to="/pos/sale" />} />
          <Route path="/pos" element={posUser ? <POSLayout user={posUser} onLogout={handlePosLogout} /> : <Navigate to="/pos/login" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<POSDashboard />} />
              <Route path="sale" element={<Sale />} />
              <Route path="sales" element={<POSSales />} />
              <Route path="products" element={<Productos />} />
              <Route path="customers" element={<POSClientes />} />
              <Route path="stock" element={<POSStock />} />
              <Route path="reports" element={<POSReports />} />
              <Route path="settings" element={<POSSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* --- Standalone Print Routes --- */}
          <Route path="/factura/print/:id" element={<FacturaPrint />} />
          <Route path="/pos/receipt/print/:id" element={<POSReceiptPrint />} />


          {/* --- Management App Routes (Catch-All) --- */}
          <Route path="*" element={<ManagementLayout />}>
              {isAuthenticated ? (
                  <>
                      {userRole === 'super-admin' && (
                          <>
                              <Route path="super/dashboard" element={<SuperDashboard />} />
                              <Route path="negocios" element={<Negocios />} />
                              <Route index element={<Navigate to="/super/dashboard" replace />} />
                          </>
                      )}
                      {userRole === 'admin' && (
                           <>
                              <Route path="dashboard" element={<Dashboard />} />
                              <Route path="clientes" element={<Clientes />} />
                              <Route path="planes" element={<Planes />} />
                              <Route path="pagos" element={<Pagos />} />
                              <Route path="facturacion" element={<Facturacion />} />
                              <Route path="facturacion/nuevo" element={<FacturaEditor />} />
                              <Route path="facturacion/editar/:id" element={<FacturaEditor />} />
                              <Route path="economia" element={<Economia />} />
                              <Route path="configuracion" element={<Configuracion />} />
                              <Route index element={<Navigate to="/dashboard" replace />} />
                          </>
                      )}
                      {userRole === 'customer' && (
                          <>
                              <Route path="portal/dashboard" element={<CustomerDashboard />} />
                              <Route path="portal/datos" element={<CustomerDatos />} />
                              <Route path="portal/pagos" element={<CustomerPagos />} />
                              <Route path="portal/suscripcion" element={<CustomerSuscripcion />} />
                              <Route path="portal/contacto" element={<CustomerContacto />} />
                              <Route index element={<Navigate to="/portal/dashboard" replace />} />
                          </>
                      )}
                      {/* If authenticated and no other route matches, go to the default dashboard */}
                       <Route path="*" element={<Navigate to="/" replace />} />
                  </>
              ) : (
                  <>
                      <Route index element={<Home />} />
                      <Route path="login" element={<Login onLogin={handleLogin} />} />
                      {/* If public and no other route matches, go to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                  </>
              )}
          </Route>
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
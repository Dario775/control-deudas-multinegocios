import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import CustomerSidebar from './components/layout/CustomerSidebar';
import Header from './components/layout/Header';
import PublicHeader from './components/layout/PublicHeader';
import PublicFooter from './components/layout/PublicFooter';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Planes from './pages/Planes';
import Pagos from './pages/Pagos';
import Facturacion from './pages/Facturacion';
import FacturaEditor from './pages/FacturaEditor';
import FacturaPrint from './pages/FacturaPrint';
import Configuracion from './pages/Configuracion';
import Login from './pages/Login';
import Home from './pages/Home';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerDatos from './pages/customer/Datos';
import CustomerPagos from './pages/customer/Pagos';
import CustomerSuscripcion from './pages/customer/Suscripcion';
import CustomerContacto from './pages/customer/Contacto';
import { ThemeContext, Theme } from './hooks/useTheme';
import { Notificacion } from './types';
import { mockNotificaciones } from './data/mockData';

const ProtectedLayout: React.FC<{
  userRole: 'admin' | 'customer';
  setUserRole: (role: 'admin' | 'customer') => void;
  onLogout: () => void;
  notifications: Notificacion[];
  setNotifications: React.Dispatch<React.SetStateAction<Notificacion[]>>;
}> = ({ userRole, setUserRole, onLogout, notifications, setNotifications }) => (
  <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    {userRole === 'admin' ? <Sidebar /> : <CustomerSidebar />}
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'customer'>('admin');
  const [notifications, setNotifications] = useState<Notificacion[]>(mockNotificaciones);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  const handleLogin = (role: 'admin' | 'customer') => {
      setUserRole(role);
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
  };

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <HashRouter>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route element={<ProtectedLayout userRole={userRole} setUserRole={setUserRole} onLogout={handleLogout} notifications={notifications} setNotifications={setNotifications} />}>
                {userRole === 'admin' ? (
                  <>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/planes" element={<Planes />} />
                    <Route path="/pagos" element={<Pagos />} />
                    <Route path="/facturacion" element={<Facturacion />} />
                    <Route path="/facturacion/nuevo" element={<FacturaEditor />} />
                    <Route path="/facturacion/editar/:id" element={<FacturaEditor />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Navigate to="/portal/dashboard" replace />} />
                    <Route path="/portal/dashboard" element={<CustomerDashboard />} />
                    <Route path="/portal/datos" element={<CustomerDatos />} />
                    <Route path="/portal/pagos" element={<CustomerPagos />} />
                    <Route path="/portal/suscripcion" element={<CustomerSuscripcion />} />
                    <Route path="/portal/contacto" element={<CustomerContacto />} />
                  </>
                )}
              </Route>
              <Route path="/factura/print/:id" element={<FacturaPrint />} />
            </>
          ) : (
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
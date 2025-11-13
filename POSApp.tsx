import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeContext, Theme } from './hooks/useTheme';
import { POSUser } from './types';
import POSLogin from './pages/pos/POSLogin';
import POSLayout from './components/pos/layout/POSLayout';
import POSDashboard from './pages/pos/POSDashboard';
import Sale from './pages/pos/Sale';
import Productos from './pages/pos/Productos';
import POSClientes from './pages/pos/POSClientes';
import POSStock from './pages/pos/POSStock';
import POSSettings from './pages/pos/POSSettings';


const POSApp: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    }
    return 'light';
  });

  const [posUser, setPosUser] = useState<POSUser | null>(null);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  const handleLogin = (user: POSUser) => {
    setPosUser(user);
  };

  const handleLogout = () => {
    setPosUser(null);
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
          {posUser ? (
            <Route element={<POSLayout user={posUser} onLogout={handleLogout} />}>
              <Route path="/pos" element={<Navigate to="/pos/dashboard" replace />} />
              <Route path="/pos/dashboard" element={<POSDashboard />} />
              {/* FIX: The Sale component gets user information from context and does not accept props. */}
              <Route path="/pos/sale" element={<Sale />} />
              <Route path="/pos/products" element={<Productos />} />
              <Route path="/pos/customers" element={<POSClientes />} />
              <Route path="/pos/stock" element={<POSStock />} />
              <Route path="/pos/settings" element={<POSSettings />} />
              <Route path="*" element={<Navigate to="/pos/dashboard" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/pos/login" element={<POSLogin onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/pos/login" replace />} />
            </>
          )}
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default POSApp;
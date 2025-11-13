import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { POSUser, SuscripcionStatus } from '../../types';
import { mockPOSUsers, mockNegocios } from '../../data/mockData';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, AlertCircleIcon } from '../../components/icons';

interface POSLoginProps {
  onLogin: (user: POSUser) => void;
}

const POSLogin: React.FC<POSLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const user = mockPOSUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user && password) { // En una app real, verificarías la contraseña (hash)
        const negocio = mockNegocios.find(n => n.id === user.negocioId);

        if (!negocio) {
            setError("Error de configuración: El negocio asociado a este usuario no existe.");
            return;
        }

        if (negocio.estadoSuscripcion !== SuscripcionStatus.Activa) {
            setError(`Acceso denegado: La suscripción del negocio "${negocio.nombre}" está inactiva.`);
            return;
        }

        if (!negocio.serviciosActivos.includes('pos')) {
            setError(`Acceso denegado: El negocio "${negocio.nombre}" no tiene contratado el servicio de POS.`);
            return;
        }

        // Si todas las verificaciones pasan:
        onLogin(user);
        navigate('/pos/sale');

    } else {
      setError("Email o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md m-auto p-8 space-y-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 border dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Terminal POS</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Inicio de sesión para cajeros y managers.</p>
           <div className="mt-4 text-xs text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              <p className="font-bold mb-1">Cuentas de Demo (POS):</p>
              <ul className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">Cajero (Activo):</span> cajero@lafamilia.com</li>
                  <li><span className="font-semibold">Manager (Activo):</span> manager@lafamilia.com</li>
                  <li><span className="font-semibold">Cajero (Inactivo):</span> cajero@granodeoro.cafe</li>
                  <li><span className="font-semibold">Cualquier contraseña:</span> 123</li>
              </ul>
              <p className="mt-2">Para volver al panel de gestión, navega a <Link to="/login" className="font-semibold text-indigo-600 hover:underline">/login</Link></p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                <AlertCircleIcon className="w-5 h-5 mr-3"/>
                <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tu@email.com" required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Contraseña
            </label>
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********" required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ingresar al POS
          </button>
        </form>
      </div>
       <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      >
        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default POSLogin;
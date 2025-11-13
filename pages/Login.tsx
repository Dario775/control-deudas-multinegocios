import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type UserRole = 'super-admin' | 'admin' | 'customer';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      let role: UserRole;
      if (email.toLowerCase().includes('super@demo.com')) {
          role = 'super-admin';
      } else if (email.toLowerCase().includes('admin@demo.com')) {
          role = 'admin';
      } else {
          role = 'customer';
      }
      
      onLogin(role);
      
      switch(role) {
          case 'super-admin':
              navigate('/super/dashboard');
              break;
          case 'admin':
              navigate('/dashboard');
              break;
          case 'customer':
              navigate('/portal/dashboard');
              break;
      }
    } else {
      alert("Por favor, ingrese email y contraseña.");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800 border dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Gestor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Inicia sesión en tu panel de gestión.</p>
          <div className="mt-4 text-xs text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              <p className="font-bold mb-1">Cuentas de Demo (Gestión):</p>
              <ul className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">Super Admin:</span> super@demo.com</li>
                  <li><span className="font-semibold">Admin Negocio:</span> admin@demo.com</li>
                  <li><span className="font-semibold">Cliente:</span> cualquier@otro.email</li>
              </ul>
              <p className="mt-2">Para acceder al POS, navega a <Link to="/pos/login" className="font-semibold text-indigo-600 hover:underline">/pos/login</Link></p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (role: 'admin' | 'customer') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Demo logic: log in as admin if email contains 'admin'
      const role = email.includes('admin') ? 'admin' : 'customer';
      onLogin(role);
      // Navigate to the respective dashboard after login
      if (role === 'admin') {
          navigate('/dashboard');
      } else {
          navigate('/portal/dashboard');
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
          <p className="mt-2 text-gray-600 dark:text-gray-400">Inicia sesión en tu cuenta</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              (Demo: usa 'admin@demo.com' para vista admin, o cualquier otro email para vista cliente)
          </p>
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

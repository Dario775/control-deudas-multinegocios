
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', ingresos: 4000 },
  { name: 'Feb', ingresos: 3000 },
  { name: 'Mar', ingresos: 5000 },
  { name: 'Abr', ingresos: 4500 },
  { name: 'May', ingresos: 6000 },
  { name: 'Jun', ingresos: 5500 },
  { name: 'Jul', ingresos: 7000 },
];

const IncomeChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Gráfica de Ingresos (Últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="name" stroke="currentColor" />
          <YAxis stroke="currentColor" tickFormatter={(value) => `$${value/1000}k`} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                borderColor: 'rgba(55, 65, 81, 1)', // border-gray-600
                color: '#fff'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TimeRange = 'week' | 'month' | 'year';

const yearData = [
  { name: 'Ene', Ingresos: 4000, Egresos: 2400 },
  { name: 'Feb', Ingresos: 3000, Egresos: 1398 },
  { name: 'Mar', Ingresos: 5000, Egresos: 9800 },
  { name: 'Abr', Ingresos: 4500, Egresos: 3908 },
  { name: 'May', Ingresos: 6000, Egresos: 4800 },
  { name: 'Jun', Ingresos: 5500, Egresos: 3800 },
  { name: 'Jul', Ingresos: 7000, Egresos: 4300 },
  { name: 'Ago', Ingresos: 6500, Egresos: 4000 },
  { name: 'Sep', Ingresos: 7200, Egresos: 5200 },
  { name: 'Oct', Ingresos: 8000, Egresos: 6000 },
  { name: 'Nov', Ingresos: 7500, Egresos: 5500 },
  { name: 'Dic', Ingresos: 9000, Egresos: 7000 },
];

const monthData = [
  { name: 'Sem 1', Ingresos: 1200, Egresos: 800 },
  { name: 'Sem 2', Ingresos: 1500, Egresos: 1100 },
  { name: 'Sem 3', Ingresos: 1300, Egresos: 950 },
  { name: 'Sem 4', Ingresos: 1800, Egresos: 1400 },
];

const weekData = [
  { name: 'Lun', Ingresos: 300, Egresos: 150 },
  { name: 'Mar', Ingresos: 450, Egresos: 200 },
  { name: 'Mié', Ingresos: 350, Egresos: 250 },
  { name: 'Jue', Ingresos: 500, Egresos: 300 },
  { name: 'Vie', Ingresos: 600, Egresos: 220 },
  { name: 'Sáb', Ingresos: 200, Egresos: 100 },
  { name: 'Dom', Ingresos: 150, Egresos: 50 },
];

const dataMap = {
  week: weekData,
  month: monthData,
  year: yearData,
};

const titleMap = {
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
}

const IncomeChart: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('year');

    const chartData = dataMap[timeRange];
    const chartTitle = `Ingresos vs. Egresos (${titleMap[timeRange]})`

    const getButtonClass = (range: TimeRange) => {
        const baseClass = 'px-3 py-1 text-sm font-medium rounded-md transition-colors';
        if (range === timeRange) {
            return `${baseClass} bg-indigo-600 text-white`;
        }
        return `${baseClass} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`;
    };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
       <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{chartTitle}</h3>
            <div className="flex items-center space-x-2">
                <button className={getButtonClass('week')} onClick={() => setTimeRange('week')}>Semana</button>
                <button className={getButtonClass('month')} onClick={() => setTimeRange('month')}>Mes</button>
                <button className={getButtonClass('year')} onClick={() => setTimeRange('year')}>Año</button>
            </div>
       </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            <Line type="monotone" dataKey="Ingresos" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Egresos" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart;

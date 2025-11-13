import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Card from '../../components/ui/Card';
import { DollarSignIcon, ReceiptTextIcon, BarcodeIcon, DownloadIcon } from '../../components/icons';
import { mockProductos, mockClientes } from '../../data/mockData';
import { Producto, Cliente } from '../../types';

// --- Mock Data Generation (for demonstration purposes) ---
interface SaleTransaction {
    id: string;
    date: Date;
    total: number;
    items: { product: Producto; quantity: number }[];
    client: Cliente;
}

const generateMockSales = (): SaleTransaction[] => {
    const sales: SaleTransaction[] = [];
    const today = new Date();
    for (let i = 0; i < 200; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Sales in the last 30 days
        
        const numItems = Math.floor(Math.random() * 5) + 1;
        const items = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = mockProductos[Math.floor(Math.random() * mockProductos.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            items.push({ product, quantity });
            total += product.precio * quantity;
        }

        sales.push({
            id: `sale-${i}`,
            date,
            total,
            items,
            client: mockClientes[Math.floor(Math.random() * mockClientes.length)]
        });
    }
    return sales.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const POSReports: React.FC = () => {
    const [sales, setSales] = useState<SaleTransaction[]>([]);
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

    useEffect(() => {
        setSales(generateMockSales());
    }, []);

    const filteredSales = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        let startDate = new Date(now);

        switch (timeRange) {
            case 'day':
                startDate.setDate(now.getDate());
                startDate.setHours(0,0,0,0);
                break;
            case 'week':
                 startDate.setDate(now.getDate() - 6);
                 startDate.setHours(0,0,0,0);
                break;
            case 'month':
                 startDate.setDate(now.getDate() - 29);
                 startDate.setHours(0,0,0,0);
                break;
        }
        
        return sales.filter(sale => sale.date >= startDate && sale.date <= now);
    }, [sales, timeRange]);
    
    const summaryData = useMemo(() => {
        const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
        const transactionCount = filteredSales.length;
        const averageTicket = transactionCount > 0 ? totalSales / transactionCount : 0;
        return { totalSales, transactionCount, averageTicket };
    }, [filteredSales]);

    const salesByCategory = useMemo(() => {
        const categoryMap = new Map<string, number>();
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                const category = item.product.categoria || 'Sin Categoría';
                const currentSales = categoryMap.get(category) || 0;
                categoryMap.set(category, currentSales + (item.product.precio * item.quantity));
            });
        });
        return Array.from(categoryMap.entries())
            .map(([name, sales]) => ({ name, sales: parseFloat(sales.toFixed(2)) }))
            .sort((a, b) => b.sales - a.sales);
    }, [filteredSales]);

    const topSellingProducts = useMemo(() => {
        const productMap = new Map<string, { name: string, quantity: number, sales: number }>();
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                const product = item.product;
                const current = productMap.get(product.id) || { name: product.nombre, quantity: 0, sales: 0 };
                current.quantity += item.quantity;
                current.sales += item.product.precio * item.quantity;
                productMap.set(product.id, current);
            });
        });
        return Array.from(productMap.values()).sort((a, b) => b.sales - a.sales).slice(0, 5);
    }, [filteredSales]);

    const getButtonClass = (range: typeof timeRange) => {
        const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors';
        if (range === timeRange) return `${base} bg-indigo-600 text-white`;
        return `${base} bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`;
    };

    const handleExportCSV = () => {
        if (filteredSales.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const headers = ['ID Venta', 'Fecha', 'Cliente', 'Productos', 'Total'];
        const rows = filteredSales.map(sale => [
            sale.id,
            sale.date.toLocaleString('es-ES'),
            sale.client.nombre,
            sale.items.map(item => `${item.quantity}x ${item.product.nombre}`).join('; '),
            sale.total.toFixed(2)
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `reporte_ventas_${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Reportes de Ventas</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Analiza el rendimiento de tu punto de venta.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-900 rounded-lg">
                        <button onClick={() => setTimeRange('day')} className={getButtonClass('day')}>Hoy</button>
                        <button onClick={() => setTimeRange('week')} className={getButtonClass('week')}>7 Días</button>
                        <button onClick={() => setTimeRange('month')} className={getButtonClass('month')}>30 Días</button>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Exportar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card title="Ventas Totales" value={`$${summaryData.totalSales.toFixed(2)}`} icon={<DollarSignIcon className="w-6 h-6"/>} />
                <Card title="Nº Transacciones" value={summaryData.transactionCount.toString()} icon={<ReceiptTextIcon className="w-6 h-6"/>} />
                <Card title="Ticket Promedio" value={`$${summaryData.averageTicket.toFixed(2)}`} icon={<BarcodeIcon className="w-6 h-6"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-96">
                    <h3 className="text-lg font-semibold mb-4">Ventas por Categoría</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12, fill: 'currentColor' }} />
                            <YAxis tickFormatter={(value) => `$${value}`} tick={{fill: 'currentColor'}} />
                            <Tooltip formatter={(value) => [`$${value}`, 'Ventas']} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)' }} />
                            <Bar dataKey="sales">
                                {salesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Productos más Vendidos</h3>
                    <ul className="space-y-4">
                        {topSellingProducts.map((product, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <span className="font-medium">{product.name}</span>
                                <div className="text-right">
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400">${product.sales.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{product.quantity} uds.</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default POSReports;
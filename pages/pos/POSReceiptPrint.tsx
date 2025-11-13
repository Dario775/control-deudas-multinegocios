import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venta } from '../../types';
import { mockVentas } from '../../data/mockData';

const POSReceiptPrint: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState<Venta | null>(null);
    
    useEffect(() => {
        const ventaToPrint = mockVentas.find(v => v.id === id);
        if (ventaToPrint) {
            setVenta(ventaToPrint);
        } else {
            alert('Venta no encontrada');
            navigate('/pos/sales');
        }
    }, [id, navigate]);

    useEffect(() => {
        if (venta) {
            const timer = setTimeout(() => window.print(), 500);
            return () => clearTimeout(timer);
        }
    }, [venta]);
    
    if (!venta) {
        return <div className="p-4 font-mono">Cargando recibo...</div>;
    }

    return (
        <div className="bg-white p-4 font-mono text-xs text-black">
            <style>
                {`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            margin: 0;
                            padding: 0;
                        }
                        @page {
                            size: 80mm auto; /* Typical receipt paper width */
                            margin: 2mm;
                        }
                    }
                `}
            </style>
            <div className="max-w-xs mx-auto">
                <div className="text-center">
                    <h1 className="text-base font-bold">Supermercado La Familia</h1>
                    <p>Calle Ficticia 123</p>
                    <p>Tel: 555-0101</p>
                    <p className="border-t border-dashed border-black my-2 pt-2">
                        {venta.receiptType}
                    </p>
                </div>

                <div className="my-2">
                    <p>Comprobante: {venta.receiptNumber}</p>
                    <p>Fecha: {venta.date}</p>
                    <p>Cliente: {venta.client?.nombre || 'Cliente Genérico'}</p>
                </div>

                <table className="w-full my-2 border-t border-b border-dashed border-black">
                    <thead>
                        <tr>
                            <th className="text-left py-1">Cant.</th>
                            <th className="text-left py-1">Producto</th>
                            <th className="text-right py-1">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venta.items.map(item => (
                            <tr key={item.producto.id}>
                                <td className="py-0.5">{item.cantidad}x</td>
                                <td className="py-0.5">{item.producto.nombre}</td>
                                <td className="py-0.5 text-right">${(item.cantidad * item.producto.precio).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>${venta.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>IMPUESTOS:</span>
                        <span>${venta.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-dashed border-black mt-1 pt-1">
                        <span>TOTAL:</span>
                        <span>${venta.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p>¡Gracias por su compra!</p>
                </div>
            </div>
        </div>
    );
};

export default POSReceiptPrint;

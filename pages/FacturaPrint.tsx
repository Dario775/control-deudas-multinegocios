import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Factura } from '../types';
import { mockFacturas } from '../data/mockData';

const FacturaPrint: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState<Factura | null>(null);
    
    useEffect(() => {
        const facturaToPrint = mockFacturas.find(f => f.id === id);
        if (facturaToPrint) {
            setFactura(facturaToPrint);
        } else {
            alert('Factura no encontrada');
            // In a real app, you might redirect to a 404 page
            // For now, we go back to the list
            navigate('/facturacion');
        }
    }, [id, navigate]);

    useEffect(() => {
        if (factura) {
            // Give a short delay for content to render before printing
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [factura]);
    
    if (!factura) {
        return <div className="p-8">Cargando factura para imprimir...</div>;
    }

    return (
        <div className="bg-white p-8 md:p-12 font-sans text-gray-800">
            <style>
                {`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        @page {
                            size: A4;
                            margin: 0;
                        }
                    }
                `}
            </style>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start pb-8 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">FACTURA</h1>
                        <p className="text-gray-500">#{factura.numero}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-indigo-600">Gestor Inc.</h2>
                        <p className="text-sm text-gray-500">Calle Ficticia 456, Suite 200</p>
                        <p className="text-sm text-gray-500">Ciudad Capital, CP 12345</p>
                        <p className="text-sm text-gray-500">contacto@gestorinc.com</p>
                    </div>
                </div>

                {/* Client Info & Dates */}
                <div className="grid grid-cols-2 gap-8 my-8">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">FACTURAR A:</p>
                        <p className="font-bold text-lg">{factura.cliente.nombre}</p>
                        <p className="text-gray-600">{factura.cliente.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm"><span className="font-semibold text-gray-500">Fecha de Emisión:</span> {factura.fechaEmision}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-500">Fecha de Vencimiento:</span> {factura.fechaVencimiento}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-3 font-semibold">Descripción</th>
                            <th className="p-3 text-right font-semibold">Cant.</th>
                            <th className="p-3 text-right font-semibold">Precio Unit.</th>
                            <th className="p-3 text-right font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {factura.items.map(item => (
                            <tr key={item.id}>
                                <td className="p-3">{item.descripcion}</td>
                                <td className="p-3 text-right">{item.cantidad}</td>
                                <td className="p-3 text-right">${item.precioUnitario.toFixed(2)}</td>
                                <td className="p-3 text-right font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Totals Section */}
                <div className="flex justify-end mt-8">
                    <div className="w-full max-w-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-medium">${factura.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Impuestos (21%):</span>
                            <span className="font-medium">${factura.impuestos.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 border-t-2 pt-3 mt-3">
                            <span>Total a Pagar:</span>
                            <span>${factura.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-12 pt-8 border-t">
                    {factura.notas && (
                         <div className="mb-4">
                            <h4 className="font-semibold text-gray-600 mb-1">Notas:</h4>
                            <p className="text-sm text-gray-500">{factura.notas}</p>
                        </div>
                    )}
                    <p className="text-sm text-center text-gray-500">¡Gracias por su negocio!</p>
                </div>
            </div>
        </div>
    );
};

export default FacturaPrint;
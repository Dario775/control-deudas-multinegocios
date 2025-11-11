import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Factura, InvoiceItem, Cliente, InvoiceStatus } from '../types';
import { PlusIcon, Trash2Icon } from '../components/icons';
import { mockClientes, mockFacturas } from '../data/mockData';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const displayToInputDate = (date: string) => {
    if (!date || !date.includes('/')) return getTodayDate();
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
};

const inputToDisplayDate = (date: string) => {
    if (!date || !date.includes('-')) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};


const FacturaEditor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const initialFacturaState: Omit<Factura, 'subtotal' | 'impuestos' | 'total'> = {
        id: id || Date.now().toString(),
        numero: `FACT-${String(Date.now()).slice(-4)}`,
        cliente: {id: '', nombre: '', email: ''},
        fechaEmision: getTodayDate(),
        fechaVencimiento: getTodayDate(),
        items: [{ id: '1', descripcion: '', cantidad: 1, precioUnitario: 0 }],
        estado: InvoiceStatus.Borrador,
        notas: '',
    };
    
    const [factura, setFactura] = useState(initialFacturaState);

    useEffect(() => {
        if (isEditing) {
            const facturaToEdit = mockFacturas.find(f => f.id === id);
            if (facturaToEdit) {
                const { subtotal, impuestos, total, ...rest } = facturaToEdit;
                setFactura({
                    ...rest,
                    fechaEmision: displayToInputDate(rest.fechaEmision),
                    fechaVencimiento: displayToInputDate(rest.fechaVencimiento)
                });
            } else {
                alert("Factura no encontrada");
                navigate('/facturacion');
            }
        }
    }, [id, isEditing, navigate]);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClient = mockClientes.find(c => c.id === e.target.value);
        if (selectedClient) {
            setFactura({ ...factura, cliente: {id: selectedClient.id, nombre: selectedClient.nombre, email: selectedClient.email} });
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFactura({ ...factura, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...factura.items];
        const itemToUpdate = { ...newItems[index] };
        
        if (field === 'cantidad' || field === 'precioUnitario') {
            (itemToUpdate[field] as number) = Number(value) || 0;
        } else if (field === 'descripcion') {
            (itemToUpdate[field] as string) = String(value);
        }
        
        newItems[index] = itemToUpdate;
        setFactura({ ...factura, items: newItems });
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            descripcion: '',
            cantidad: 1,
            precioUnitario: 0
        };
        setFactura({ ...factura, items: [...factura.items, newItem] });
    };

    const removeItem = (index: number) => {
        const newItems = factura.items.filter((_, i) => i !== index);
        setFactura({ ...factura, items: newItems });
    };

    const { subtotal, impuestos, total } = useMemo(() => {
        const subtotal = factura.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
        const impuestos = subtotal * 0.21; // Example tax rate 21%
        const total = subtotal + impuestos;
        return { subtotal, impuestos, total };
    }, [factura.items]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalFactura: Factura = { 
            ...factura,
            fechaEmision: inputToDisplayDate(factura.fechaEmision),
            fechaVencimiento: inputToDisplayDate(factura.fechaVencimiento),
            subtotal,
            impuestos,
            total
        };
        console.log('Guardando factura:', finalFactura);
        // Here you would send the data to your API
        alert(`Factura ${isEditing ? 'actualizada' : 'creada'} con éxito!`);
        navigate('/facturacion');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {isEditing ? `Editar Factura #${factura.numero}` : 'Crear Nuevo Comprobante'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-8">
                {/* Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="cliente" className="block text-sm font-medium mb-1">Cliente</label>
                        <select id="cliente" value={factura.cliente.id} onChange={handleClientChange} required className="w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0">
                            <option value="" disabled>Seleccionar cliente</option>
                            {mockClientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                    <div className="text-right">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="numero" className="block text-sm font-medium mb-1">Nº Factura</label>
                                <input type="text" id="numero" name="numero" value={factura.numero} onChange={handleInputChange} required className="w-full text-right rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                            </div>
                            <div>
                                <label htmlFor="fechaEmision" className="block text-sm font-medium mb-1">Fecha Emisión</label>
                                <input type="date" id="fechaEmision" name="fechaEmision" value={factura.fechaEmision} onChange={handleInputChange} required className="w-full text-right rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                            </div>
                            <div></div>
                            <div>
                                <label htmlFor="fechaVencimiento" className="block text-sm font-medium mb-1">Fecha Vencimiento</label>
                                <input type="date" id="fechaVencimiento" name="fechaVencimiento" value={factura.fechaVencimiento} onChange={handleInputChange} required className="w-full text-right rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Cantidad</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Precio Unit.</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Total</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {factura.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2"><input type="text" value={item.descripcion} onChange={e => handleItemChange(index, 'descripcion', e.target.value)} placeholder="Servicio o producto" className="w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" /></td>
                                    <td className="p-2"><input type="number" value={item.cantidad} onChange={e => handleItemChange(index, 'cantidad', e.target.value)} className="w-full text-right rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" /></td>
                                    <td className="p-2"><input type="number" value={item.precioUnitario} onChange={e => handleItemChange(index, 'precioUnitario', e.target.value)} className="w-full text-right rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0" /></td>
                                    <td className="p-2 pr-4 text-right font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" onClick={addItem} className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    <PlusIcon className="w-4 h-4 mr-1" />Añadir Ítem
                </button>
                
                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                         <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Impuestos (21%):</span>
                            <span>${impuestos.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label htmlFor="notas" className="block text-sm font-medium mb-1">Notas</label>
                    <textarea id="notas" name="notas" value={factura.notas ?? ''} onChange={handleInputChange} rows={3} placeholder="Términos y condiciones, notas de agradecimiento, etc." className="w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-0"></textarea>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={() => navigate('/facturacion')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        Cancelar
                    </button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Guardar Factura
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacturaEditor;
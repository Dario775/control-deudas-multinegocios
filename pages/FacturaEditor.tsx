import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Factura, InvoiceItem, Cliente, InvoiceStatus } from '../types';
import { PlusIcon, Trash2Icon, BuildingIcon, SaveIcon } from '../components/icons';
import { mockClientes, mockFacturas } from '../data/mockData';
import { getTodayDateInput, displayToInputDate, inputToDisplayDate } from '../utils/date';

const FacturaEditor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const initialFacturaState: Omit<Factura, 'subtotal' | 'impuestos' | 'total'> = {
        id: id || Date.now().toString(),
        numero: `FACT-${String(Date.now()).slice(-4)}`,
        cliente: {id: '', nombre: '', email: ''},
        fechaEmision: getTodayDateInput(),
        fechaVencimiento: getTodayDateInput(),
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
        if (factura.items.length <= 1) return; // Must have at least one item
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

        if (!factura.cliente.id) {
            alert("Por favor, selecciona un cliente.");
            return;
        }

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

    const baseInputStyle = "w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm";
    
    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {isEditing ? `Editar Factura #${factura.numero}` : 'Crear Nuevo Comprobante'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-8 space-y-10">
                    {/* Header: From / To / Details */}
                    <header className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                             <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">DE:</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <BuildingIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">Mi Empresa Inc.</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">contacto@miempresa.com</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cliente" className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">PARA:</label>
                                <select id="cliente" value={factura.cliente.id} onChange={handleClientChange} required className={baseInputStyle}>
                                    <option value="" disabled>Seleccionar cliente</option>
                                    {mockClientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                                {factura.cliente.email && <p className="text-xs text-gray-500 mt-2">{factura.cliente.email}</p>}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="numero" className="text-sm font-medium text-gray-500">Nº Factura</label>
                                <input type="text" id="numero" name="numero" value={factura.numero} onChange={handleInputChange} required className={`${baseInputStyle} mt-1`} />
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="fechaEmision" className="text-sm font-medium text-gray-500">Emisión</label>
                                    <input type="date" id="fechaEmision" name="fechaEmision" value={factura.fechaEmision} onChange={handleInputChange} required className={`${baseInputStyle} mt-1`} />
                                </div>
                                 <div>
                                    <label htmlFor="fechaVencimiento" className="text-sm font-medium text-gray-500">Vencimiento</label>
                                    <input type="date" id="fechaVencimiento" name="fechaVencimiento" value={factura.fechaVencimiento} onChange={handleInputChange} required className={`${baseInputStyle} mt-1`} />
                                </div>
                             </div>
                        </div>
                    </header>

                    {/* Items Table */}
                    <div className="space-y-3">
                        {/* Headers */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            <div className="md:col-span-6">Descripción</div>
                            <div className="md:col-span-2 text-right">Cantidad</div>
                            <div className="md:col-span-2 text-right">Precio Unit.</div>
                            <div className="md:col-span-2 text-right">Total</div>
                        </div>
                        {/* Items */}
                        <div className="space-y-2">
                             {factura.items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className="col-span-12 md:col-span-6">
                                        <input type="text" value={item.descripcion} onChange={e => handleItemChange(index, 'descripcion', e.target.value)} placeholder="Servicio o producto" className={baseInputStyle} />
                                    </div>
                                     <div className="col-span-4 md:col-span-2">
                                        <input type="number" value={item.cantidad} onChange={e => handleItemChange(index, 'cantidad', e.target.value)} className={`${baseInputStyle} text-right`} />
                                    </div>
                                    <div className="col-span-4 md:col-span-2">
                                        <input type="number" value={item.precioUnitario} onChange={e => handleItemChange(index, 'precioUnitario', e.target.value)} step="0.01" className={`${baseInputStyle} text-right`} />
                                    </div>
                                    <div className="col-span-3 md:col-span-2 flex items-center justify-end space-x-2">
                                        <p className="font-medium text-sm text-right w-full text-gray-800 dark:text-gray-200">${(item.cantidad * item.precioUnitario).toFixed(2)}</p>
                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" disabled={factura.items.length <= 1}>
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addItem} className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline pt-2">
                            <PlusIcon className="w-4 h-4 mr-1" />Añadir Ítem
                        </button>
                    </div>

                    {/* Footer: Notes & Totals */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <label htmlFor="notas" className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Notas</label>
                            <textarea id="notas" name="notas" value={factura.notas ?? ''} onChange={handleInputChange} rows={4} placeholder="Términos y condiciones, notas de agradecimiento, etc." className={baseInputStyle}></textarea>
                        </div>
                        <div className="flex justify-end">
                            <div className="w-full max-w-sm space-y-3">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                    <span>Impuestos (21%):</span>
                                    <span className="font-medium">${impuestos.toFixed(2)}</span>
                                </div>
                                <div className="!mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 rounded-b-lg">
                    <button type="button" onClick={() => navigate('/facturacion')} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Guardar Comprobante
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacturaEditor;

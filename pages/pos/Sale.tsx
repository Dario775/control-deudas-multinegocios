import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Producto, TicketItem, Cliente, HeldTicket } from '../../types';
import { mockProductos, mockClientes } from '../../data/mockData';
import { SearchIcon, UserIcon, Trash2Icon, PercentIcon, PauseIcon, PlayIcon, CreditCardIcon, BanknoteIcon } from '../../components/icons';
import ProductCard from '../../components/pos/ProductCard';
import TicketItemComponent from '../../components/pos/TicketItem';
import ResumeSaleModal from '../../components/modals/ResumeSaleModal';
import DiscountModal from '../../components/modals/DiscountModal';
import PaymentPOSModal from '../../components/modals/PaymentPOSModal';
import { usePOSUser } from '../../components/pos/layout/POSLayout';

const NumpadButton: React.FC<{ onKeyPress: (key: string) => void; value: string; className?: string }> = ({ onKeyPress, value, className = '' }) => (
  <button
    type="button"
    onClick={() => onKeyPress(value)}
    className={`py-3 text-xl font-semibold rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  >
    {value}
  </button>
);


const Sale: React.FC = () => {
    const user = usePOSUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [ticket, setTicket] = useState<TicketItem[]>([]);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
    const [discount, setDiscount] = useState(0);
    const [heldTickets, setHeldTickets] = useState<HeldTicket[]>([]);
    
    // Modals state
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
    const [amountReceived, setAmountReceived] = useState('');
    const [changeToReturn, setChangeToReturn] = useState(0);

    // Barcode scanner simulation state
    const [skuInput, setSkuInput] = useState('');
    const lastKeystroke = useRef(0);
    const skuInputRef = useRef(skuInput);
    skuInputRef.current = skuInput;

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(mockProductos.map(p => p.categoria).filter(Boolean))] as string[];
        return ['Todos', ...uniqueCategories.sort()];
    }, []);

    const filteredProducts = useMemo(() => {
        return mockProductos.filter(p => {
            const matchesCategory = !activeCategory || activeCategory === 'Todos' || p.categoria === activeCategory;
            const matchesSearch = !searchTerm || p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);

    const addToTicket = useCallback((product: Producto) => {
        setTicket(prev => {
            const existingItem = prev.find(item => item.producto.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.producto.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { producto: product, cantidad: 1 }];
        });
    }, []);
    
    const updateQuantity = (productId: string, newQuantity: number) => {
        setTicket(prev => prev.map(item =>
            item.producto.id === productId
                ? { ...item, cantidad: newQuantity }
                : item
        ));
    };

    const removeFromTicket = (productId: string) => {
        setTicket(prev => prev.filter(item => item.producto.id !== productId));
    };
    
    const { subtotal, impuestos, total, totalDiscount } = useMemo(() => {
        const subtotal = ticket.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
        const impuestos = subtotal * 0.21; // 21% tax
        const totalBeforeDiscount = subtotal + impuestos;
        const totalDiscount = totalBeforeDiscount * (discount / 100);
        const total = totalBeforeDiscount - totalDiscount;
        return { subtotal, impuestos, total, totalDiscount };
    }, [ticket, discount]);

    const clearTicket = () => {
        setTicket([]);
        setSelectedClient(null);
        setDiscount(0);
        setAmountReceived('');
        setPaymentMethod('efectivo');
    };

    const handleNewSale = () => {
        clearTicket();
        setIsSuccessModalOpen(false);
    };

    const holdTicket = () => {
        if (ticket.length === 0) return;
        const newHeldTicket: HeldTicket = {
            id: `held-${Date.now()}`,
            items: ticket,
            client: selectedClient,
            date: new Date(),
            total,
        };
        setHeldTickets(prev => [...prev, newHeldTicket]);
        clearTicket();
    };

    const resumeTicket = (heldTicket: HeldTicket) => {
        clearTicket();
        setTicket(heldTicket.items);
        setSelectedClient(heldTicket.client);
        setHeldTickets(prev => prev.filter(t => t.id !== heldTicket.id));
        setIsResumeModalOpen(false);
    };

    const handleNumpadInput = (key: string) => {
        if (key === 'C') {
            setAmountReceived('');
        } else if (key === '⌫') {
            setAmountReceived(val => val.slice(0, -1));
        } else {
            if (key === '.' && amountReceived.includes('.')) return;
            setAmountReceived(val => val + key);
        }
    };
    
    const handleFinalizeSale = () => {
        if (ticket.length === 0) return;
        const received = parseFloat(amountReceived);
        if (paymentMethod === 'efectivo') {
            if (isNaN(received) || received < total) {
                alert('El monto recibido es insuficiente.');
                return;
            }
            setChangeToReturn(received - total);
        } else {
            setChangeToReturn(0);
        }
        setIsSuccessModalOpen(true);
    };

    // Barcode scanner simulation effect
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (skuInputRef.current) {
                    const product = mockProductos.find(p => p.sku === skuInputRef.current);
                    if (product) {
                        addToTicket(product);
                    }
                    setSkuInput('');
                }
                return;
            }

            if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
                e.preventDefault();
                const now = Date.now();
                if (now - lastKeystroke.current > 100) {
                    setSkuInput(e.key);
                } else {
                    setSkuInput(prev => prev + e.key);
                }
                lastKeystroke.current = now;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [addToTicket]);

    if (!user) return null;
    const userRole = user.role;

    const change = (parseFloat(amountReceived) || 0) - total;

    return (
        <div className="grid grid-cols-12 h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            {/* Ticket Column */}
            <aside className="col-span-12 lg:col-span-3 bg-white dark:bg-gray-900 flex flex-col h-full shadow-lg">
                <div className="p-4 border-b dark:border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg">Ticket de Venta</h2>
                        <button onClick={clearTicket} className="text-sm text-red-500 hover:underline disabled:opacity-50" disabled={ticket.length === 0}><Trash2Icon className="w-5 h-5 inline-block mr-1" /> Limpiar</button>
                    </div>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select value={selectedClient?.id || ''} onChange={(e) => setSelectedClient(mockClientes.find(c => c.id === e.target.value) || null)} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                            <option value="">Cliente Genérico</option>
                            {mockClientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                    {userRole === 'pos-manager' && (
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setIsDiscountModalOpen(true)} disabled={ticket.length === 0} className="flex items-center justify-center text-sm py-2 px-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><PercentIcon className="w-4 h-4 mr-2"/>Aplicar Descuento</button>
                            <button onClick={holdTicket} disabled={ticket.length === 0} className="flex items-center justify-center text-sm py-2 px-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><PauseIcon className="w-4 h-4 mr-2"/>Suspender</button>
                        </div>
                    )}
                    {userRole === 'pos-manager' && heldTickets.length > 0 && (
                        <button onClick={() => setIsResumeModalOpen(true)} className="w-full flex items-center justify-center text-sm py-2 px-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900"><PlayIcon className="w-4 h-4 mr-2"/>Ventas Suspendidas ({heldTickets.length})</button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {ticket.length === 0 ? (<p className="text-center text-gray-500 pt-10">Agrega productos al ticket.</p>) : (ticket.map(item => (<TicketItemComponent key={item.producto.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromTicket} />)))}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Impuestos (21%)</span><span>${impuestos.toFixed(2)}</span></div>
                        {discount > 0 && <div className="flex justify-between text-red-500"><span>Descuento ({discount}%)</span><span>-${totalDiscount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-2xl font-bold pt-2 border-t border-gray-300 dark:border-gray-600"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
                </div>
            </aside>

            {/* Catalog Column */}
            <main className="col-span-12 lg:col-span-5 flex flex-col h-full p-4 overflow-hidden">
                 <div className="flex items-center flex-shrink-0 mb-4 gap-4">
                    <div className="relative flex-grow">
                        <input type="text" placeholder="Buscar producto o escanear código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="flex-shrink-0 mb-4 -mx-4 px-4 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                    {categories.map(category => (
                        <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            {category}
                        </button>
                    ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-grow overflow-y-auto pr-2 -mr-2">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToTicket} />
                    ))}
                </div>
            </main>
            
            {/* Payment Column */}
            <aside className="col-span-12 lg:col-span-4 bg-gray-50 dark:bg-gray-800 flex flex-col h-full p-4 border-l border-gray-200 dark:border-gray-700">
                 <div className="flex-grow flex flex-col">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => setPaymentMethod('efectivo')} className={`flex items-center justify-center py-3 rounded-lg border-2 transition-colors ${paymentMethod === 'efectivo' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50' : 'border-transparent bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}><BanknoteIcon className="w-5 h-5 mr-2"/> <span className="font-semibold">Efectivo</span></button>
                        <button onClick={() => setPaymentMethod('tarjeta')} className={`flex items-center justify-center py-3 rounded-lg border-2 transition-colors ${paymentMethod === 'tarjeta' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50' : 'border-transparent bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}><CreditCardIcon className="w-5 h-5 mr-2"/> <span className="font-semibold">Tarjeta</span></button>
                    </div>

                    {paymentMethod === 'efectivo' ? (
                        <div className="flex-grow flex flex-col space-y-2">
                            <label htmlFor="amountReceivedInput" className="text-sm font-medium">Monto Recibido</label>
                            <input id="amountReceivedInput" type="text" readOnly value={`$ ${amountReceived || '0.00'}`} className="w-full text-right text-3xl font-bold p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"/>
                            <div className="grid grid-cols-3 gap-2 flex-grow">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map(k => <NumpadButton key={k} value={k} onKeyPress={handleNumpadInput}/>)}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setAmountReceived(total.toFixed(2))} className="py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600">Monto Exacto</button>
                                <button onClick={() => setAmountReceived('50')} className="py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600">$50</button>
                                <button onClick={() => setAmountReceived('100')} className="py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600">$100</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center bg-white dark:bg-gray-700/50 rounded-lg p-4">
                            <CreditCardIcon className="w-16 h-16 text-gray-400 mb-4"/>
                            <p className="text-center font-semibold">Procesar pago con el terminal de tarjeta.</p>
                            <p className="text-center text-sm text-gray-500 mt-2">El monto a cobrar es ${total.toFixed(2)}.</p>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    {paymentMethod === 'efectivo' && (
                        <div className="flex justify-between text-xl font-bold mb-3">
                            <span>Vuelto:</span>
                            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>${(ticket.length > 0 && amountReceived) ? change.toFixed(2) : '0.00'}</span>
                        </div>
                    )}
                    <button onClick={handleFinalizeSale} disabled={ticket.length === 0} className="w-full py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Finalizar Venta
                    </button>
                </div>
            </aside>
            
            <PaymentPOSModal isOpen={isSuccessModalOpen} onClose={handleNewSale} changeToReturn={changeToReturn} />
            <ResumeSaleModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} heldTickets={heldTickets} onResume={resumeTicket} />
            <DiscountModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} onApply={(d) => { setDiscount(d); setIsDiscountModalOpen(false); }} />
        </div>
    );
};

export default Sale;

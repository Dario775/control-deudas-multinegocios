import React, { useState, useEffect, useRef } from 'react';
import { TicketItem } from '../../types';
import { Trash2Icon, PlusIcon } from '../icons';

interface TicketItemProps {
    item: TicketItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemove: (productId: string) => void;
}

const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const TicketItemComponent: React.FC<TicketItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [quantity, setQuantity] = useState(item.cantidad.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuantity(item.cantidad.toString());
    }, [item.cantidad]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);


    const handleQuantityChange = (amount: number) => {
        const newQuantity = item.cantidad + amount;
        if (newQuantity > 0) {
            onUpdateQuantity(item.producto.id, newQuantity);
        } else {
            onRemove(item.producto.id);
        }
    };
    
    const handleBlur = () => {
        const newQuantity = parseInt(quantity, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            onUpdateQuantity(item.producto.id, newQuantity);
        } else {
            setQuantity(item.cantidad.toString()); // revert
        }
        setIsEditing(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setQuantity(item.cantidad.toString());
            setIsEditing(false);
        }
    };


    const totalPrice = item.producto.precio * item.cantidad;

    return (
        <div className="flex items-center space-x-3 py-3">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.producto.nombre}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <button onClick={() => handleQuantityChange(-1)} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                        {item.cantidad === 1 ? <Trash2Icon className="w-4 h-4 text-red-500" /> : <MinusIcon className="w-4 h-4" />}
                    </button>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-12 text-center bg-white dark:bg-gray-700 border border-indigo-500 rounded-md"
                        />
                    ) : (
                        <span onClick={() => setIsEditing(true)} className="text-sm font-bold w-12 text-center cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                           x{item.cantidad}
                        </span>
                    )}
                    <button onClick={() => handleQuantityChange(1)} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold">${totalPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">@ ${item.producto.precio.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default TicketItemComponent;
'use client'

import { useState } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { addToCart } from "@/lib/cart";

type AddToCartProps = {
    productId: string;
    quantity?: number;
    onCartUpdate?: () => void;
}

export function AddToCart_Component({ productId, quantity = 1, onCartUpdate }: AddToCartProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        
        // Agregar al carrito
        addToCart(productId, quantity);
        
        // Notificar cambio al carrito (para que recargue)
        if (onCartUpdate) {
            onCartUpdate();
        }
        
        // Feedback visual
        setJustAdded(true);
        setTimeout(() => {
            setJustAdded(false);
            setIsAdding(false);
        }, 2000);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
                ${justAdded 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-sky-500 hover:bg-sky-600'}
                text-white font-semibold py-3 px-6 rounded-lg
                transition-all duration-200
                flex items-center gap-2 justify-center
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {justAdded ? (
                <>
                    <FaCheck />
                    <span>Agregado al carrito</span>
                </>
            ) : (
                <>
                    <FaShoppingCart />
                    <span>Agregar al carrito</span>
                </>
            )}
        </button>
    );
}
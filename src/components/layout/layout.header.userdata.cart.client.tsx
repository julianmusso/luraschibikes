'use client'

import { useState, useEffect } from "react";

type CartItem = {
    quantity: number;
}

export function CartBadge() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const stored = localStorage.getItem('cart');
            if (stored) {
                const cart: CartItem[] = JSON.parse(stored);
                const total = cart.reduce((sum, item) => sum + item.quantity, 0);
                setCount(total);
            } else {
                setCount(0);
            }
        };

        updateCount();

        window.addEventListener('cartUpdated', updateCount);
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') updateCount();
        });

        return () => {
            window.removeEventListener('cartUpdated', updateCount);
            window.removeEventListener('storage', updateCount);
        };
    }, []);

    if (count === 0) return null;

    return (
        <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
        </span>
    );
}

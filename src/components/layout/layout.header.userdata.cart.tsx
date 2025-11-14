'use client'

import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCartProducts } from "@/core/server.getCartProducts";
import Link from "next/link";
import { CartBadge } from "./layout.header.userdata.cart.client";

type CartItem = {
    id: string;
    quantity: number;
}

type CartProduct = CartItem & {
    name: string;
    price: number;
    image?: string;
}

export function Cart_Component() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleCartUpdate = () => {
            const storedCart = localStorage.getItem('cart');
            const newCart = storedCart ? JSON.parse(storedCart) : [];
            setCartItems(newCart);
        };

        handleCartUpdate();

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                handleCartUpdate();
            }
        });

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        if (cartItems.length === 0) {
            return;
        }

        const loadProducts = async () => {
            setIsLoading(true);
            const productIds = cartItems.map(item => item.id);
            const products = await getCartProducts(productIds);
            
            const hydrated = cartItems.map(item => {
                const product = products.find((p: { id: string }) => p.id === item.id);
                return product ? { ...item, ...product } : null;
            }).filter(Boolean) as CartProduct[];
            
            setCartProducts(hydrated);
            setIsLoading(false);
        };

        loadProducts();
    }, [cartItems]);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="relative p-3 cursor-pointer text-white hover:text-sky-300 transition-all">
                <FaShoppingCart size={24} />
                <CartBadge />
            </button>

            {/* Dropdown del carrito */}
            {isOpen && (
                <div className="absolute right-0 mt-0 pt-1 w-80 bg-blue-900 shadow-lg rounded-md overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-sky-700">
                        <h3 className="font-semibold text-white">Carrito de Compras</h3>
                    </div>
                    
                    {cartItems.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-300">
                            Tu carrito está vacío
                        </div>
                    ) : isLoading ? (
                        <div className="px-4 py-6 text-center text-gray-300 flex flex-col items-center gap-2">
                            <FaSpinner className="animate-spin text-2xl" />
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto">
                                {cartProducts.map((item) => (
                                    <div key={item.id} className="px-4 py-3 border-b border-sky-800 hover:bg-sky-800 transition-all">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-gray-300 text-sm">Cantidad: {item.quantity}</p>
                                            </div>
                                            <p className="text-sky-300 font-semibold ml-2">
                                                ${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 bg-sky-900">
                                <Link href="/carrito" className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded transition-all text-center">
                                    Ver Carrito
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
'use client';

import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { getCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cart";
import { getCartProducts } from "@/core/server.getCartProducts";
import { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { getWhatsAppLink } from "@/lib/helpers/whatsapp";
import { formatOrderForWhatsApp } from "@/lib/helpers/formatOrderForWhatsapp";

type CartProduct = {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
};

export default function Carrito_Page() {
    // Estado del componente
    const [cartItems, setCartItems] = useState<{ id: string; quantity: number }[]>([]);
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Función para cargar el carrito y obtener los datos de los productos
    const loadCart = async () => {
        const cart = getCart();
        setCartItems(cart);

        if (cart.length > 0) {
            const productData = await getCartProducts(cart.map(item => item.id));
            setProducts(productData);
        } else {
            setProducts([]);
        }
        setLoading(false);
    };

    // Efecto para cargar el carrito y sincronizar con eventos de actualización
    useEffect(() => {
        const handleCartUpdate = () => {
            loadCart();
        };

        // Cargar inicialmente
        handleCartUpdate();

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

    // Handlers para acciones del carrito
    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemove = (productId: string) => {
        removeFromCart(productId);
    };

    const handleClearCart = () => {
        if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
            clearCart();
            setCartItems([]);
            setProducts([]);
        }
    };

    // Helpers para cálculos
    const getProductQuantity = (productId: string) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    const subtotal = products.reduce((sum, product) => {
        const quantity = getProductQuantity(product.id);
        return sum + (product.price * quantity);
    }, 0);

    // Generar mensaje formateado para WhatsApp
    const generateWhatsAppMessage = () => {
        const orderItems = products.map(product => ({
            name: product.name,
            quantity: getProductQuantity(product.id),
            price: product.price
        }));

        return formatOrderForWhatsApp(orderItems);
    };

    // Estado de carga
    if (loading) {
        return (
            <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
                <PageTitle title="Carrito de Compras" />
                <LuraschiCard>
                    <div className="text-center py-12 text-slate-400">
                        Cargando carrito...
                    </div>
                </LuraschiCard>
            </main>
        );
    }

    // Carrito vacío
    if (cartItems.length === 0) {
        return (
            <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
                <PageTitle title="Carrito de Compras" />
                <LuraschiCard>
                    <div className="text-center py-12 space-y-4">
                        <FaShoppingCart className="text-6xl text-slate-600 mx-auto" />
                        <p className="text-slate-400 text-lg">Tu carrito está vacío</p>
                        <Link
                            href="/tienda"
                            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded transition-colors"
                        >
                            Ir a la tienda
                        </Link>
                    </div>
                </LuraschiCard>
            </main>
        );
    }

    // Renderizado principal del carrito
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Carrito de Compras" subtitle={`${cartItems.length} producto${cartItems.length > 1 ? 's' : ''}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                    {products.map(product => {
                        const quantity = getProductQuantity(product.id);
                        const itemTotal = product.price * quantity;

                        return (
                            <LuraschiCard key={product.id}>
                                <div className="flex gap-4">
                                    {/* Imagen */}
                                    <div className="w-24 h-24 shrink-0 bg-slate-800 rounded overflow-hidden">
                                        {product.image && (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                        <p className="text-blue-400 font-bold">${product.price.toLocaleString('es-AR')}</p>

                                        {/* Cantidad */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <label className="text-sm text-slate-400">Cantidad:</label>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(product.id, quantity - 1)}
                                                    className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-semibold">{quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(product.id, quantity + 1)}
                                                    className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Warning de stock */}
                                        {quantity > product.stock && (
                                            <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                                                <p className="text-yellow-400 text-sm flex items-center gap-2">
                                                    ⚠️ Solo hay {product.stock} disponibles
                                                    <button
                                                        onClick={() => handleUpdateQuantity(product.id, product.stock)}
                                                        className="ml-auto text-xs bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded transition-colors"
                                                    >
                                                        Ajustar a {product.stock}
                                                    </button>
                                                </p>
                                            </div>
                                        )}
                                        {quantity <= product.stock && product.stock <= 5 && (
                                            <p className="mt-2 text-orange-400 text-sm">⚡ Últimas {product.stock} unidades</p>
                                        )}
                                    </div>

                                    {/* Subtotal y eliminar */}
                                    <div className="text-right space-y-3">
                                        <p className="font-bold text-xl">${itemTotal.toLocaleString('es-AR')}</p>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 ml-auto"
                                        >
                                            <FaTrash />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </LuraschiCard>
                        );
                    })}

                    {/* Botón limpiar carrito */}
                    <button
                        onClick={handleClearCart}
                        className="text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                        Vaciar carrito
                    </button>
                </div>

                {/* Resumen */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <LuraschiCard>
                        <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-300">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-3">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-blue-400">${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/checkout"
                                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded text-center transition-colors"
                            >
                                Finalizar Compra
                            </Link>

                            <a
                                href={getWhatsAppLink(generateWhatsAppMessage())}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded text-center transition-colors items-center justify-center gap-2"
                            >
                                <FaWhatsapp />
                                Comprar por WhatsApp
                            </a>

                            <Link
                                href="/tienda"
                                className="block text-center text-slate-400 hover:text-white transition-colors"
                            >
                                Seguir comprando
                            </Link>
                        </div>
                    </LuraschiCard>
                </div>
            </div>
        </main>
    );
}

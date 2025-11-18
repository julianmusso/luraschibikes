'use client';

import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { getCart, clearCart, updateQuantity } from "@/lib/cart";
import { getCartProducts } from "@/core/server.getCartProducts";
import { StartBuying } from "@/core/server.StartBuying";
import { useEffect, useState } from "react";
import { FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type CartProduct = {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
};

export default function Checkout_Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [cartItems, setCartItems] = useState<{ id: string; quantity: number }[]>([]);
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [stockIssues, setStockIssues] = useState<Array<{ productId: string; productName: string; requested: number; available: number }>>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        zipCode: '',
        notes: '',
        paymentMethod: 'transferencia',
    });

    useEffect(() => {
        // Detectar errores de pago desde query params
        const error = searchParams.get('error');
        if (error) {
            switch (error) {
                case 'payment_cancelled':
                    setErrorMessage('El pago fue cancelado. Podés intentar nuevamente cuando quieras.');
                    break;
                case 'payment_failed':
                    setErrorMessage('El pago falló. Por favor, verificá tus datos e intentá nuevamente.');
                    break;
                case 'payment_rejected':
                    setErrorMessage('El pago fue rechazado. Intentá con otro método de pago.');
                    break;
                default:
                    setErrorMessage('Ocurrió un error con el pago. Intentá nuevamente.');
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const loadCart = async () => {
            const cart = getCart();
            setCartItems(cart);

            if (cart.length === 0) {
                router.push('/carrito');
                return;
            }

            const productData = await getCartProducts(cart.map(item => item.id));
            setProducts(productData);
            
            // Validar stock
            const issues = cart
                .map(item => {
                    const product = productData.find((p: CartProduct) => p.id === item.id);
                    if (!product) return null;
                    if (item.quantity > product.stock) {
                        return {
                            productId: item.id,
                            productName: product.name,
                            requested: item.quantity,
                            available: product.stock
                        };
                    }
                    return null;
                })
                .filter(Boolean) as Array<{ productId: string; productName: string; requested: number; available: number }>;
            
            setStockIssues(issues);
            setLoading(false);
        };

        loadCart();
    }, [router]);

    const getProductQuantity = (productId: string) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    const subtotal = products.reduce((sum, product) => {
        const quantity = getProductQuantity(product.id);
        return sum + (product.price * quantity);
    }, 0);

    const handleAdjustStock = () => {
        stockIssues.forEach(issue => {
            updateQuantity(issue.productId, issue.available);
        });
        // Recargar carrito
        window.location.reload();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Llamar al Server Action
            const result = await StartBuying(
                cartItems,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    province: formData.province,
                    zipCode: formData.zipCode
                }
            );

            if (!result.success) {
                let errorMsg = 'No se pudo procesar la compra';
                
                switch (result.error) {
                    case 'insufficient_stock':
                        errorMsg = 'Stock insuficiente. Por favor, ajustá las cantidades.';
                        setErrorMessage(errorMsg);
                        router.push('/carrito');
                        break;
                    case 'mercadopago_unauthorized':
                    case 'mercadopago_invalid_token':
                        errorMsg = 'Error de configuración de MercadoPago. Contactá a soporte.';
                        setErrorMessage(errorMsg);
                        break;
                    case 'mercadopago_timeout':
                        errorMsg = 'MercadoPago no respondió. Intentá nuevamente en unos minutos.';
                        setErrorMessage(errorMsg);
                        break;
                    case 'order_creation_failed':
                        errorMsg = 'No se pudo crear el pedido. Intentá nuevamente.';
                        setErrorMessage(errorMsg);
                        break;
                    default:
                        errorMsg = result.message || 'Error desconocido al procesar la compra';
                        setErrorMessage(errorMsg);
                }
                
                setProcessing(false);
                return;
            }

            // Redirigir a MercadoPago usando router
            if (result.init_point) {
                router.push(result.init_point);
            }
        } catch (error) {
            console.error('Error en checkout:', error);
            alert('Ocurrió un error. Por favor, intentá nuevamente.');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
                <PageTitle title="Finalizar Compra" />
                <LuraschiCard>
                    <div className="text-center py-12 text-slate-400">Cargando...</div>
                </LuraschiCard>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Finalizar Compra" subtitle="Completá tus datos para procesar el pedido" />

            {/* Banner de error de pago */}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-bold text-lg mb-2">Error en el pago</h3>
                            <p className="text-red-300 mb-3">{errorMessage}</p>
                            <button
                                onClick={() => setErrorMessage(null)}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner de problemas de stock */}
            {stockIssues.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-900/30 border-2 border-yellow-600 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="text-yellow-400 font-bold text-lg mb-2">Problemas de stock detectados</h3>
                            <ul className="space-y-1 text-yellow-300 text-sm mb-3">
                                {stockIssues.map(issue => (
                                    <li key={issue.productId}>
                                        <strong>{issue.productName}:</strong> Pediste {issue.requested}, solo hay {issue.available} disponibles
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAdjustStock}
                                    className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded transition-colors"
                                >
                                    Ajustar cantidades automáticamente
                                </button>
                                <Link
                                    href="/carrito"
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded transition-colors"
                                >
                                    Volver al carrito
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <LuraschiCard>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaUser className="text-blue-400" />
                                Datos Personales
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Apellido *</label>
                                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                </div>
                            </div>
                        </LuraschiCard>

                        <LuraschiCard>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-400" />
                                Dirección de Envío
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Dirección *</label>
                                    <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Calle y número" className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Ciudad *</label>
                                        <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Provincia *</label>
                                        <input type="text" required value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Código Postal *</label>
                                        <input type="text" required value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </LuraschiCard>

                        <LuraschiCard>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaCreditCard className="text-blue-400" />
                                Método de Pago
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="transferencia" checked={formData.paymentMethod === 'transferencia'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4" />
                                    <span>Transferencia Bancaria</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="efectivo" checked={formData.paymentMethod === 'efectivo'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4" />
                                    <span>Efectivo (al retirar en local)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="mercadopago" checked={formData.paymentMethod === 'mercadopago'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4" />
                                    <span>Mercado Pago</span>
                                </label>
                            </div>
                        </LuraschiCard>

                        <LuraschiCard>
                            <h2 className="text-xl font-bold mb-4">Notas Adicionales</h2>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} placeholder="Información adicional sobre tu pedido (opcional)" className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400" />
                        </LuraschiCard>
                    </div>

                    <div className="lg:sticky lg:top-24 h-fit">
                        <LuraschiCard>
                            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                            <div className="space-y-3 mb-4">
                                {products.map(product => {
                                    const quantity = getProductQuantity(product.id);
                                    return (
                                        <div key={product.id} className="flex gap-3">
                                            <div className="w-16 h-16 shrink-0 bg-slate-800 rounded overflow-hidden">
                                                {product.image && <Image src={product.image} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-slate-400">x{quantity}</p>
                                                <p className="text-blue-400 font-semibold">${(product.price * quantity).toLocaleString('es-AR')}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="border-t border-slate-700 pt-4 space-y-2">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Envío</span>
                                    <span className="text-green-400">A calcular</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2">
                                    <div className="flex justify-between font-bold text-xl">
                                        <span>Total</span>
                                        <span className="text-blue-400">${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded transition-colors">
                                    {processing ? 'Procesando...' : 'Confirmar Pedido'}
                                </button>
                                <Link href="/carrito" className="block text-center text-slate-400 hover:text-white transition-colors">
                                    Volver al carrito
                                </Link>
                            </div>
                        </LuraschiCard>
                    </div>
                </div>
            </form>
        </main>
    );
}

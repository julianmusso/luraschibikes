import { client } from '@/sanity/lib/client';
import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { FaCheckCircle, FaClock, FaTruck, FaBox, FaTimesCircle, FaUndo } from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from 'react';

type OrderItem = {
    _key: string;
    product: {
        _ref: string;
    };
    productSnapshot: {
        name: string;
        imageUrl: string;
    };
    quantity: number;
    unitPrice: number;
    subtotal: number;
};

type Order = {
    _id: string;
    orderNumber: string;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
    customer: {
        name: string;
        email: string;
        phone: string;
        dni: string;
    };
    items: OrderItem[];
    payment: {
        status: string;
        paymentMethod: string;
        transactionAmount: number;
        preferenceId?: string;
        statusDetail?: string;
    };
    shipping: {
        address: {
            street: string;
            number: string;
            floor?: string;
            city: string;
            state: string;
            zipCode: string;
        };
        trackingNumber?: string;
    };
    totals: {
        subtotal: number;
        shipping: number;
        total: number;
    };
    createdAt: string;
    paidAt?: string;
};

async function getOrder(orderNumber: string): Promise<Order | null> {
    // Pedido hardcodeado para testing
    if (orderNumber === 'julian') {
        return {
            _id: 'test-julian-001',
            orderNumber: 'ORD-20251117-999',
            status: 'paid',
            customer: {
                name: 'Julian Musso',
                email: 'julian@example.com',
                phone: '+54 9 11 1234-5678',
                dni: '12345678'
            },
            items: [
                {
                    _key: 'item-1',
                    product: { _ref: 'product-1' },
                    productSnapshot: {
                        name: 'Bicicleta Mountain Bike Pro',
                        imageUrl: '/assets/images/product_placeholder.png'
                    },
                    quantity: 1,
                    unitPrice: 450000,
                    subtotal: 450000
                },
                {
                    _key: 'item-2',
                    product: { _ref: 'product-2' },
                    productSnapshot: {
                        name: 'Casco Profesional',
                        imageUrl: '/assets/images/product_placeholder.png'
                    },
                    quantity: 2,
                    unitPrice: 35000,
                    subtotal: 70000
                }
            ],
            payment: {
                status: 'approved',
                paymentMethod: 'mercadopago',
                transactionAmount: 520000,
                preferenceId: 'mock-preference-id'
            },
            shipping: {
                address: {
                    street: 'Av. Corrientes',
                    number: '1234',
                    floor: '5A',
                    city: 'Buenos Aires',
                    state: 'CABA',
                    zipCode: '1043'
                },
                trackingNumber: 'MP-2025-1117-ABC123'
            },
            totals: {
                subtotal: 520000,
                shipping: 0,
                total: 520000
            },
            createdAt: new Date().toISOString(),
            paidAt: new Date(Date.now() - 3600000).toISOString() // Hace 1 hora
        };
    }

    const order = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]{
            _id,
            orderNumber,
            status,
            customer,
            items,
            payment{
                status,
                paymentMethod,
                transactionAmount,
                preferenceId,
                statusDetail
            },
            shipping{
                address{
                    street,
                    number,
                    floor,
                    city,
                    state,
                    zipCode
                },
                trackingNumber
            },
            totals,
            createdAt,
            paidAt
        }`,
        { orderNumber },
        { next: { revalidate: 10 } } // Revalidar cada 10 segundos para actualizar status
    );

    return order;
}

async function OrderContent({ orderIdPromise }: { orderIdPromise: Promise<string> }) {
    const orderId = await orderIdPromise;
    const order = await getOrder(orderId);

    if (!order) {
        notFound();
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <>
            <PageTitle
                title={`Pedido ${order.orderNumber}`}
                subtitle={`Realizado el ${new Date(order.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}`}
            />

            {/* Status Banner */}
            <div className={`my-6 p-6 bg-${statusInfo.color}-900/30 border-2 border-${statusInfo.color}-600 rounded-lg`}>
                <div className="flex items-center gap-4">
                    {statusInfo.icon}
                    <div className="flex-1">
                        <h2 className={`text-${statusInfo.color}-400 font-bold text-2xl mb-1`}>{statusInfo.title}</h2>
                        <p className={`text-${statusInfo.color}-300`}>{statusInfo.description}</p>

                        {/* Botón de pagar (solo para MercadoPago con pago pendiente/rechazado) */}
                        {(order.payment.status === 'pending' || order.payment.status === 'rejected' || order.payment.status === 'cancelled') && order.payment.preferenceId && (
                            <div className="mt-4">
                                <p className="text-sm text-yellow-200 mb-2">
                                    {order.payment.status === 'rejected' 
                                        ? 'El pago fue rechazado. Podés intentar nuevamente.'
                                        : order.payment.status === 'cancelled'
                                        ? 'El pago fue cancelado. Podés volver a intentar.'
                                        : 'Podés completar el pago desde MercadoPago. El pedido se confirmará automáticamente.'
                                    }
                                </p>
                                {order.payment.statusDetail && (
                                    <p className="text-xs text-yellow-300/70 mb-3">
                                        Detalle: {order.payment.statusDetail}
                                    </p>
                                )}
                                <a
                                    href={`https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${order.payment.preferenceId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded transition-colors"
                                >
                                    💳 Completar Pago
                                </a>
                                <p className="text-xs text-yellow-300/70 mt-2">
                                    Esta página se actualiza automáticamente cada 10 segundos.
                                </p>
                            </div>
                        )}

                        {/* Información para pagos offline (transferencia/efectivo) */}
                        {order.payment.status === 'pending' && !order.payment.preferenceId && (
                            <div className="mt-4">
                                <p className="text-sm text-yellow-200 mb-2">
                                    {order.payment.paymentMethod === 'transferencia' 
                                        ? 'Pago por transferencia bancaria - Te contactaremos con los datos para realizar la transferencia.'
                                        : order.payment.paymentMethod === 'efectivo'
                                        ? 'Pago en efectivo - Te contactaremos para coordinar la entrega y el pago.'
                                        : 'Te contactaremos para coordinar el pago.'
                                    }
                                </p>
                                <p className="text-xs text-yellow-300/70">
                                    Revisá tu email para más detalles.
                                </p>
                            </div>
                        )}

                        {order.paidAt && (
                            <p className="text-sm text-green-300 mt-2">
                                Pagado el {new Date(order.paidAt).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Productos */}
                    <LuraschiCard>
                        <h2 className="text-xl font-bold mb-4">Productos del Pedido</h2>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item._key} className="flex gap-4 pb-4 border-b border-slate-700 last:border-0">
                                    <div className="w-20 h-20 shrink-0 bg-slate-800 rounded overflow-hidden">
                                        {item.productSnapshot.imageUrl && (
                                            <Image
                                                src={item.productSnapshot.imageUrl}
                                                alt={item.productSnapshot.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.productSnapshot.name}</h3>
                                        <p className="text-slate-400 text-sm">Cantidad: {item.quantity}</p>
                                        <p className="text-slate-400 text-sm">
                                            Precio unitario: ${item.unitPrice.toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-400">
                                            ${item.subtotal.toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuraschiCard>

                    {/* Datos del Cliente */}
                    <LuraschiCard>
                        <h2 className="text-xl font-bold mb-4">Datos de Contacto</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Nombre:</span>
                                <span className="font-medium">{order.customer.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Email:</span>
                                <span className="font-medium">{order.customer.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Teléfono:</span>
                                <span className="font-medium">{order.customer.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">DNI:</span>
                                <span className="font-medium">{order.customer.dni}</span>
                            </div>
                        </div>
                    </LuraschiCard>

                    {/* Dirección de Envío */}
                    <LuraschiCard>
                        <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
                        <div className="text-sm space-y-1">
                            <p>{order.shipping.address.street} {order.shipping.address.number}{order.shipping.address.floor ? `, Piso ${order.shipping.address.floor}` : ''}</p>
                            <p>{order.shipping.address.city}, {order.shipping.address.state}</p>
                            <p>CP: {order.shipping.address.zipCode}</p>
                            {order.shipping.trackingNumber && (
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                    <p className="text-slate-400">Código de seguimiento:</p>
                                    <p className="font-mono font-bold text-purple-400">{order.shipping.trackingNumber}</p>
                                </div>
                            )}
                        </div>
                    </LuraschiCard>
                </div>

                {/* Resumen del Pedido */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <LuraschiCard>
                        <h2 className="text-xl font-bold mb-4">Resumen</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-slate-300">
                                <span>Subtotal</span>
                                <span>${order.totals.subtotal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Envío</span>
                                <span>
                                    {order.totals.shipping === 0
                                        ? <span className="text-green-400">A calcular</span>
                                        : `$${order.totals.shipping.toLocaleString('es-AR')}`
                                    }
                                </span>
                            </div>
                            <div className="border-t border-slate-700 pt-3">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-blue-400">${order.totals.total.toLocaleString('es-AR')}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-700 text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Método de pago:</span>
                                    <span className="font-medium capitalize">{order.payment.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Estado del pago:</span>
                                    <span className={`font-medium ${
                                        order.payment.status === 'approved' || order.payment.status === 'paid'
                                        ? 'text-green-400'
                                        : order.payment.status === 'rejected'
                                        ? 'text-red-400'
                                        : 'text-yellow-400'
                                    }`}>
                                        {order.payment.status === 'approved' || order.payment.status === 'paid' 
                                            ? 'Pagado' 
                                            : order.payment.status === 'rejected'
                                            ? 'Rechazado'
                                            : 'Pendiente'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Link
                                href="/tienda"
                                className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition-colors"
                            >
                                Seguir Comprando
                            </Link>
                            <Link
                                href="/cuenta"
                                className="block text-center text-slate-400 hover:text-white transition-colors"
                            >
                                Ver todos mis pedidos
                            </Link>
                        </div>
                    </LuraschiCard>
                </div>
            </div>
        </>
    );
}

function OrderSkeleton() {
    return (
        <>
            {/* Skeleton Title */}
            <div className="mb-8">
                <div className="h-10 bg-slate-700/50 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-700/30 rounded w-96 animate-pulse"></div>
            </div>

            {/* Skeleton Status Banner */}
            <div className="mb-6 p-6 bg-slate-800/50 border-2 border-slate-700 rounded-lg animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-8 bg-slate-700 rounded w-48"></div>
                        <div className="h-4 bg-slate-700/70 rounded w-96"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Skeleton Productos */}
                    <LuraschiCard>
                        <div className="h-6 bg-slate-700 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-4 pb-4 border-b border-slate-700 last:border-0 animate-pulse">
                                    <div className="w-20 h-20 shrink-0 bg-slate-700 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-700/70 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-700/70 rounded w-1/3"></div>
                                    </div>
                                    <div className="h-6 bg-slate-700 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </LuraschiCard>

                    {/* Skeleton Datos del Cliente */}
                    <LuraschiCard>
                        <div className="h-6 bg-slate-700 rounded w-40 mb-4 animate-pulse"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between animate-pulse">
                                    <div className="h-4 bg-slate-700/70 rounded w-20"></div>
                                    <div className="h-4 bg-slate-700 rounded w-48"></div>
                                </div>
                            ))}
                        </div>
                    </LuraschiCard>

                    {/* Skeleton Dirección */}
                    <LuraschiCard>
                        <div className="h-6 bg-slate-700 rounded w-44 mb-4 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                        </div>
                    </LuraschiCard>
                </div>

                {/* Skeleton Resumen */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <LuraschiCard>
                        <div className="h-6 bg-slate-700 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between animate-pulse">
                                    <div className="h-4 bg-slate-700/70 rounded w-20"></div>
                                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                                </div>
                            ))}
                            <div className="border-t border-slate-700 pt-3">
                                <div className="flex justify-between animate-pulse">
                                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                                    <div className="h-6 bg-slate-700 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="h-12 bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-6 bg-slate-700/50 rounded animate-pulse"></div>
                        </div>
                    </LuraschiCard>
                </div>
            </div>
        </>
    );
}

function getStatusInfo(status: string) {
    switch (status) {
        case 'pending':
            return {
                icon: <FaClock className="text-yellow-400 text-4xl" />,
                title: 'Pago Pendiente',
                description: 'Tu pedido está esperando confirmación de pago.',
                color: 'yellow'
            };
        case 'paid':
            return {
                icon: <FaCheckCircle className="text-green-400 text-4xl" />,
                title: '¡Pago Confirmado!',
                description: 'Tu pago fue confirmado. Estamos preparando tu pedido.',
                color: 'green'
            };
        case 'processing':
            return {
                icon: <FaBox className="text-blue-400 text-4xl" />,
                title: 'Preparando Pedido',
                description: 'Estamos preparando tus productos para el envío.',
                color: 'blue'
            };
        case 'shipped':
            return {
                icon: <FaTruck className="text-purple-400 text-4xl" />,
                title: 'En Camino',
                description: 'Tu pedido está en camino.',
                color: 'purple'
            };
        case 'completed':
            return {
                icon: <FaCheckCircle className="text-green-400 text-4xl" />,
                title: 'Entregado',
                description: '¡Tu pedido fue entregado con éxito!',
                color: 'green'
            };
        case 'cancelled':
            return {
                icon: <FaTimesCircle className="text-red-400 text-4xl" />,
                title: 'Cancelado',
                description: 'Este pedido fue cancelado.',
                color: 'red'
            };
        case 'refunded':
            return {
                icon: <FaUndo className="text-orange-400 text-4xl" />,
                title: 'Reembolsado',
                description: 'El pago de este pedido fue reembolsado.',
                color: 'orange'
            };
        default:
            return {
                icon: <FaClock className="text-gray-400 text-4xl" />,
                title: 'Estado Desconocido',
                description: 'Contactá a soporte para más información.',
                color: 'gray'
            };
    }
}

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
    const orderIdPromise = params.then(p => p.orderId);

    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <Suspense fallback={<OrderSkeleton />}>
                <OrderContent orderIdPromise={orderIdPromise} />
            </Suspense>
        </main>
    );
}
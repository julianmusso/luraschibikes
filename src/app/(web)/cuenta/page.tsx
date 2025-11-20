import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { FaBox } from "react-icons/fa";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import ProfileEditor from "./ProfileEditor";
import { Suspense } from "react";
import { PrismaClient } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";

const prisma = new PrismaClient();

type Order = {
    _id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    totals: {
        total: number;
    };
    payment: {
        status: string;
    };
};

async function getUserOrders(userEmail: string): Promise<Order[]> {
    const orders = await client.fetch(
        `*[_type == "order" && customer.email == $email] | order(createdAt desc) {
            _id,
            orderNumber,
            status,
            createdAt,
            totals,
            payment
        }`,
        { email: userEmail },
        { next: { revalidate: 0 } }
    );
    return orders;
}

async function getDatosUsuario(userId: string) {
    'use cache'

    cacheLife({ stale: 300 }); // 5 minutos
    cacheTag(`user:${userId}`);

    // Obtener datos completos del usuario desde Prisma
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    return user;
}

async function AccountContent() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    // Obtener datos completos del usuario desde Prisma
    const user = await getDatosUsuario(session.user.id);

    if (!user) {
        redirect('/login');
    }

    const orders = await getUserOrders(session.user.email);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: 'Pendiente', color: 'bg-yellow-600' },
            paid: { label: 'Pagado', color: 'bg-green-600' },
            processing: { label: 'Procesando', color: 'bg-blue-600' },
            shipped: { label: 'Enviado', color: 'bg-purple-600' },
            completed: { label: 'Completado', color: 'bg-green-600' },
            cancelled: { label: 'Cancelado', color: 'bg-red-600' },
            refunded: { label: 'Reembolsado', color: 'bg-orange-600' }
        };
        const info = statusMap[status] || { label: status, color: 'bg-gray-600' };
        return (
            <span className={`${info.color} text-white text-xs px-3 py-1 rounded-full`}>
                {info.label}
            </span>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del Usuario */}
            <div className="lg:col-span-1">
                <LuraschiCard>
                    <ProfileEditor initialData={{
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        dni: user.dni,
                        address: user.address,
                        number: user.number,
                        floor: user.floor,
                        apartment: user.apartment,
                        city: user.city,
                        province: user.province,
                        zipCode: user.zipCode
                    }} />

                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <LogoutButton />
                    </div>
                </LuraschiCard>
            </div>

            {/* Pedidos */}
            <div className="lg:col-span-2">
                <LuraschiCard>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FaBox className="text-blue-400" />
                        Mis Pedidos ({orders.length})
                    </h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <FaBox className="text-6xl text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 mb-4">Aún no has realizado ningún pedido</p>
                            <Link
                                href="/tienda"
                                className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded transition-colors"
                            >
                                Explorar productos
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Link
                                    key={order._id}
                                    href={`/pedido/${order.orderNumber}`}
                                    className="block p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500 rounded-lg transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                                            <p className="text-slate-400 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('es-AR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                                        <span className="text-slate-400 text-sm">
                                            Pago: {order.payment.status === 'approved' || order.payment.status === 'paid' ? (
                                                <span className="text-green-400">Pagado</span>
                                            ) : order.payment.status === 'rejected' ? (
                                                <span className="text-red-400">Rechazado</span>
                                            ) : (
                                                <span className="text-yellow-400">Pendiente</span>
                                            )}
                                        </span>
                                        <span className="font-bold text-blue-400 text-lg">
                                            ${order.totals.total.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </LuraschiCard>
            </div>
        </div>
    );
}

export default function CuentaPage() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle
                title="Mi Cuenta"
                subtitle="Gestiona tu información y revisa tus pedidos"
            />
            <Suspense fallback={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <LuraschiCard>
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                            </div>
                        </LuraschiCard>
                    </div>
                    <div className="lg:col-span-2">
                        <LuraschiCard>
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                                <div className="h-20 bg-slate-700 rounded"></div>
                                <div className="h-20 bg-slate-700 rounded"></div>
                            </div>
                        </LuraschiCard>
                    </div>
                </div>
            }>
                <AccountContent />
            </Suspense>
        </main>
    );
}
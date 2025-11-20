import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
import { LuraschiCard } from "@/components/ui/ui.card";
import { PageTitle } from "@/components/ui/ui.page.title";

function CheckoutSkeleton() {
    return (
        <main className="max-w-7xl mx-auto my-16 px-4 lg:px-0">
            <PageTitle title="Finalizar Compra" />
            <LuraschiCard>
                <div className="text-center py-12 text-slate-400">Cargando...</div>
            </LuraschiCard>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutClient />
        </Suspense>
    );
}


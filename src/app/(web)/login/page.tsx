import { Suspense } from 'react';
import LoginClient from './LoginClient';
import { LuraschiCard } from '@/components/ui/ui.card';

export default async function LoginPage() {

    return (
        <main className="max-w-lg mx-auto my-24 px-4">
            <Suspense fallback={
                <LuraschiCard>
                    <div className="text-center py-12 text-slate-400">Cargando...</div>
                </LuraschiCard>
            }>
                <LoginClient />
            </Suspense>
        </main>
    );
}
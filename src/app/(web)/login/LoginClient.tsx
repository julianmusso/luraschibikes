'use client';
import { useState } from 'react';
import { LuraschiCard } from '@/components/ui/ui.card';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';

export default function LoginClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { data: session } = authClient.useSession();

    // Si ya está autenticado, redirigir
    if (session) {
        router.push('/cuenta');
        return null;
    }

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            await authClient.signIn.social({
                provider: "google",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    return (
        <>
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            )}

            <LuraschiCard>
                <div className="py-8 px-2">
                    {/* Descripción */}
                    <div className="text-center mb-5">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Iniciar Sesión
                        </h2>
                    </div>

                    {/* Botón de Google mejorado */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="cursor-pointer w-full bg-white hover:bg-gray-50 disabled:bg-slate-600 disabled:cursor-not-allowed text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
                    >
                        <FaGoogle className="text-xl  transition-transform duration-200" />
                        <span>{loading ? 'Redirigiendo...' : 'Continuar con Google'}</span>
                    </button>

                    {/* Términos */}
                    <p className="text-center text-xs text-slate-500 mt-8 leading-relaxed">
                        Al continuar, aceptás nuestros{' '}
                        <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                            términos y condiciones
                        </span>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <Link
                        href="/"
                        className="cursor-pointer block text-center text-slate-400 hover:text-white transition-colors font-medium"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </LuraschiCard>
        </>
    );
}

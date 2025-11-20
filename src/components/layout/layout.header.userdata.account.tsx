'use client'

import { FaUser } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { useRouter, usePathname } from "next/navigation";

type AccountProps = {
    session: {
        user: {
            id: string;
            name: string;
            email: string;
        };
    } | null;
}

export function Account_Component({ session }: AccountProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const isLoggedIn = !!session;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        // Si está en cuenta, redirigir a login, sino quedarse en la página actual
                        if (pathname === '/cuenta') {
                            router.push('/login');
                        } else {
                            router.refresh();
                        }
                    },
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className=" p-3 cursor-pointer text-white hover:text-sky-300 transition-all">
                <FaUser size={24} />
            </button>

            {/* Dropdown del usuario */}
            {isOpen && (
                <div className="absolute right-0 mt-0 pt-1 w-48 bg-blue-900 shadow-lg rounded-md overflow-hidden z-50">
                    {isLoggedIn ? (
                        <>
                            <Link 
                                href="/cuenta"
                                className="block px-4 py-3 text-white hover:bg-sky-800 transition-all"
                            >
                                Mi Cuenta
                            </Link>
                            <button 
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="cursor-pointer w-full text-left px-4 py-3 text-white hover:bg-sky-800 transition-all border-t border-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login"
                                className="block px-4 py-3 text-white hover:bg-sky-800 transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
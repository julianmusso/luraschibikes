'use client'

import { FaUser } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

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
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = !!session;

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
                            <Link 
                                href="/pedidos"
                                className="block px-4 py-3 text-white hover:bg-sky-800 transition-all"
                            >
                                Mis Pedidos
                            </Link>
                            <button 
                                className="w-full text-left px-4 py-3 text-white hover:bg-sky-800 transition-all border-t border-sky-700"
                                onClick={() => {
                                    // TODO: Implementar logout
                                    console.log('Logout');
                                }}
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login"
                                className="block px-4 py-3 text-white hover:bg-sky-800 transition-all"
                            >
                                Ingresar
                            </Link>
                            <Link 
                                href="/registro"
                                className="block px-4 py-3 text-white hover:bg-sky-800 transition-all"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
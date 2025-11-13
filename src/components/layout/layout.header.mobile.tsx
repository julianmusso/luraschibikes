'use client'

import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routing";
import { usePathname } from "next/navigation";

type MobileMenuProps = {
    session: {
        user: {
            id: string;
            name: string;
            email: string;
        };
    } | null;
}

export function MobileMenu_Component({ session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isLoggedIn = !!session;

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Botón hamburguesa */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-sky-300 transition-all p-2"
                aria-label="Menu"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeMenu}
                />
            )}

            {/* Menu lateral */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-80 bg-blue-900 shadow-xl z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header del menú */}
                    <div className="flex justify-between items-center p-4 border-b border-sky-700">
                        <h2 className="text-white font-semibold text-lg">Menú</h2>
                        <button
                            onClick={closeMenu}
                            className="text-white hover:text-sky-300 transition-all"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Sección de cuenta */}
                        <div className="border-b border-sky-700 py-4">
                            <div className="px-4 mb-3 flex items-center gap-2 text-sky-300">
                                <FaUser />
                                <span className="font-semibold">Cuenta</span>
                            </div>
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/cuenta"
                                        onClick={closeMenu}
                                        className={`
                                            block px-6 py-3 text-white hover:bg-sky-800 transition-all
                                            ${pathname === '/cuenta' ? 'bg-sky-800' : ''}
                                        `}
                                    >
                                        Mi Cuenta
                                    </Link>
                                    <Link
                                        href="/pedidos"
                                        onClick={closeMenu}
                                        className={`
                                            block px-6 py-3 text-white hover:bg-sky-800 transition-all
                                            ${pathname === '/pedidos' ? 'bg-sky-800' : ''}
                                        `}
                                    >
                                        Mis Pedidos
                                    </Link>
                                    <button
                                        onClick={() => {
                                            // TODO: Implementar logout
                                            console.log('Logout');
                                            closeMenu();
                                        }}
                                        className="w-full text-left px-6 py-3 text-white hover:bg-sky-800 transition-all"
                                    >
                                        Salir
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block px-6 py-3 text-white hover:bg-sky-800 transition-all"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href="/registro"
                                        onClick={closeMenu}
                                        className="block px-6 py-3 text-white hover:bg-sky-800 transition-all"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Navegación principal */}
                        <div className="py-4">
                            {ROUTES.map((route) => (
                                <div key={route.name}>
                                    <Link
                                        href={route.path}
                                        onClick={closeMenu}
                                        className={`
                                            block px-6 py-3 text-white hover:bg-sky-800 transition-all font-medium
                                            ${pathname === route.path ? 'bg-sky-800 text-sky-300' : ''}
                                        `}
                                    >
                                        {route.name}
                                    </Link>
                                    {/* Subitems si existen */}
                                    {route.subItems && (
                                        <div className="bg-sky-950 bg-opacity-50">
                                            {route.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.path}
                                                    onClick={closeMenu}
                                                    className={`
                                                        block px-10 py-2 text-white hover:bg-sky-800 transition-all text-sm
                                                        ${pathname === subItem.path ? 'bg-sky-800 text-sky-300' : ''}
                                                    `}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

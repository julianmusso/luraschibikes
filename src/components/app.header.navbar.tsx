'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routing";
import { useState } from "react";

export function Navbar_Component() {

    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleMouseEnter = (routeName: string) => {
        setOpenDropdown(routeName);
    };

    const handleMouseLeave = () => {
        setOpenDropdown(null);
    };

    return (
        <nav className="my-auto">
            <ul className="flex space-x-6">
                {ROUTES.map((route) => (
                    <li 
                        key={route.name}
                        className="relative"
                        onMouseEnter={() => route.subItems && handleMouseEnter(route.name)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link href={route.path}
                            className={`
                                ${pathname === route.path || route.subItems?.some(sub => pathname.startsWith(sub.path)) 
                                    ? `text-sky-300 font-semibold` 
                                    : `text-white font-semibold`}
                                text-lg 
                            hover:text-sky-300 transition-all`} >
                            {route.name}
                            {route.subItems && <span className="ml-1">▾</span>}
                        </Link>

                        {/* Dropdown Menu */}
                        {route.subItems && openDropdown === route.name && (
                            <ul className="absolute top-full left-0 mt-0 pt-2 bg-blue-900 shadow-lg rounded-md overflow-hidden min-w-[200px]">
                                {route.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link 
                                            href={subItem.path}
                                            className={`
                                                ${pathname === subItem.path 
                                                    ? 'bg-sky-700 text-sky-200' 
                                                    : 'text-white'}
                                                block px-4 py-3 hover:bg-sky-800 transition-all
                                            `}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}
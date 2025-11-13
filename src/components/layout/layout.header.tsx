import { Suspense } from "react";
import { Navbar_Component } from "./layout.header.navbar";
import Image from "next/image";
import { Navbar_STATIC_Component } from "./layout.header.navbar.static";
import { UserData_Component } from "./layout.header.userdata";
import { MobileMenu_Server_Component } from "./layout.header.mobile.server";
import { Cart_Component } from "./layout.header.userdata.cart";
import { FaBars } from "react-icons/fa";

export function Header_Component() {
    return (
        <header className="z-50 bg-linear-to-r from-blue-600 to-sky-900 h-20 sticky top-0 w-full shadow-md flex ">
            <div className="max-w-7xl w-full mx-auto flex justify-between px-4 lg:px-0">
                {/* Logo */}
                <div className="my-auto">
                    <Image
                        src={"/assets/logo-white.webp"}
                        alt="Logo"
                        width={279}
                        height={50}
                        className="h-auto w-auto max-h-12"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-10 my-auto">
                    <Suspense fallback={<Navbar_STATIC_Component />}>
                        <Navbar_Component />
                    </Suspense>
                    <Suspense>
                        <UserData_Component />
                    </Suspense>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-4">
                    <Cart_Component />
                    <Suspense fallback={<FaBars size={24} className="text-white" />}>
                        <MobileMenu_Server_Component />
                    </Suspense>
                </div>
            </div>
        </header>
    )
}
import { Suspense } from "react";
import { Navbar_Component } from "./app.header.navbar";
import Image from "next/image";

export function Header_Component() {
    return (
        <header className="z-50 bg-blue-900 h-20 sticky top-0 w-full shadow-md flex ">
            <div>
                <Image
                    src={"/assets/logo-white.webp"}
                    alt="Logo"
                    width={335}
                    height={60}
                    className="my-auto"
                />
            </div>
            <Suspense>
                <Navbar_Component />
            </Suspense>
        </header>
    )
}
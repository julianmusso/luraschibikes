import { Suspense } from "react";
import { Navbar_Component } from "./app.header.navbar";
import Image from "next/image";
import { Navbar_STATIC_Component } from "./app.header.navbar.static";
import { UserData_Component } from "./app.header.userdata";

export function Header_Component() {
    return (
        <header className="z-50 bg-linear-to-r from-blue-600 to-sky-900 h-20 sticky top-0 w-full shadow-md flex ">
            <div className="max-w-7xl w-full mx-auto flex justify-between">
                <div className="my-auto">
                    <Image
                        src={"/assets/logo-white.webp"}
                        alt="Logo"
                        width={279}
                        height={50}
                    />
                </div>
                <div className="flex gap-10 my-auto">
                    <Suspense fallback={<Navbar_STATIC_Component />}>
                        <Navbar_Component />
                    </Suspense>
                    <Suspense>
                        <UserData_Component />
                    </Suspense>
                </div>
            </div>

        </header>
    )
}
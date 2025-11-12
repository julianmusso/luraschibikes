import { Suspense } from "react";
import { Navbar_Component } from "./app.header.navbar";

export function Header_Component() {
    return (
        <header>
            Header Component
            <Suspense>
                <Navbar_Component />
            </Suspense>
        </header>
    )
}
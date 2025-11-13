import Link from "next/link";
import { ROUTES } from "@/lib/constants/routing";

export function Navbar_STATIC_Component() {

    return (
        <nav className="my-auto">
            <ul className="flex space-x-6">
                {ROUTES.map((route) => (
                    <li key={route.name}>
                        <Link href={route.path}
                            className={`
                                text-white font-semibold
                                text-lg hover:text-sky-300 transition-all`} >
                            {route.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
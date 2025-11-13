import { getSession } from "@/lib/getSession";
import { MobileMenu_Component } from "./layout.header.mobile";

export async function MobileMenu_Server_Component() {
    const session = await getSession();
    return <MobileMenu_Component session={session} />;
}

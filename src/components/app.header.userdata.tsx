

import { Cart_Component } from "./app.header.userdata.cart";
import { Account_Component } from "./app.header.userdata.account";
import { getSession } from "@/lib/getSession";

export async function UserData_Component() {
    const session = await getSession();
    
    return (
        <div className="flex items-center gap-6">
            <Cart_Component />
            <Account_Component session={session} />
        </div>
    )
}
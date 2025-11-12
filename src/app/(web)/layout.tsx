import { Footer_Component } from "@/components/app.footer"
import { Header_Component } from "@/components/app.header"

export default function WebLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Header_Component />
            <main>{children}</main>
            <Footer_Component />
        </div>
    )
}
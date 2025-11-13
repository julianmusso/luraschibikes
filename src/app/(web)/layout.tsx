import { Footer_Component } from "@/components/layout/layout.footer"
import { Header_Component } from "@/components/layout/layout.header"

export default function Web_Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Header_Component />
            <main>
                {children}
            </main>
            <Footer_Component />
        </div>
    )
}
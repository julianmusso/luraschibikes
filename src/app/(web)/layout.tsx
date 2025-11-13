import { Footer_Component } from "@/components/layout/layout.footer"
import { Header_Component } from "@/components/layout/layout.header"
import { BackgroundGrid } from "@/components/ui/background-grid"

export default function Web_Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header_Component />
            <main className="flex-1">
                <BackgroundGrid />
                {children}
            </main>
            <Footer_Component />
        </div>
    )
}
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative bg-black text-white h-[500px] sm:h-[600px] md:h-[calc(100vh-80px)] flex items-center">
            {/* Desktop: imagen alineada a la derecha */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-auto h-full">
                <Image
                    src={"/assets/images/bici_cover.webp"}
                    alt="Bici Cover"
                    width={1536}
                    height={1024}
                    className="h-full w-auto opacity-100 brightness-110"
                    priority
                />
            </div>

            {/* Mobile: imagen de fondo con gradient overlay */}
            <div className="md:hidden absolute inset-0">
                <Image
                    src={"/assets/images/bici_cover.webp"}
                    alt="Bici Cover"
                    fill
                    className="object-cover object-right opacity-40 brightness-110"
                    priority
                />
            </div>

            <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-8 flex flex-col justify-center h-full">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-none font-bold font-heading tracking-widest">LURASCHI</h1>
                    <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-none font-bold font-heading tracking-widest text-sky-400">BIKES</span>
                    <div>
                        <p className="mt-4 max-w-xl text-base sm:text-lg md:text-xl font-base">
                            Diseñadas para la ciudad. Construidas para durar.
                        </p>
                    </div>
                    <div className="flex">
                        <Link href="/tienda" className="flex mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors duration-300">
                            Ver catálogo completo
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
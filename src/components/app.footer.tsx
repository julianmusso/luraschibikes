import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa6'

function WhatsappButton() {
    return (
        <a href="https://wa.me/5491123456789" className="cursor-pointer" target="_blank" rel="noopener noreferrer">
            <button className="cursor-pointer fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all">
                <FaWhatsapp size={24} />
            </button>
        </a>
    );
}

export function Footer_Component() {
    return (
        <footer className='bg-slate-800 py-8'>
            <div className='max-w-7xl mx-auto pb-8'>
                <div className='flex mb-5 tracking-widest'>
                    <Image src="/assets/images/luraschi_icon.png" alt="Logo" width={56} height={56} className='border-2 border-white rounded-full' />
                    <span className='text-white font-light text-2xl my-auto ml-4'>LURASCHI</span>
                    <span className='text-white font-bold text-2xl my-auto ml-3'>BIKES</span>
                </div>
                <section className="grid lg:grid-cols-3">
                    <section className="text-neutral-300 font-light space-y-5">
                        <div>
                            <p>Av. Independencia 2250 – LOCAL</p>
                            <p>Av. Independencia 2190, CABA– LOCAL</p>
                        </div>
                        <div>
                            <Link href="mailto:contacto@luraschibikes.com.ar"
                                className='underline-2'>
                                contacto@luraschibikes.com.ar
                            </Link>
                        </div>
                        <div className='text-white font-medium'>
                            <p>Número celular:</p>
                            <p>+54 9 11 5338-1636</p>
                        </div>
                    </section>
                    <section className="">
                        <h4 className="font-bold">EXPLORAR</h4>
                        <Link href="/tienda">Catálogo</Link>
                        <Link href="/ubicacion">Puntos de venta</Link>
                        <Link href="/contacto">Contacto</Link>
                        <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
                        <Link href="/privacidad">Política de privacidad</Link>
                        <div className='flex'>
                            <Link href="https://instagram.com/luraschibikes">
                                <FaInstagram size={24} className="cursor-pointer hover:text-pink-500 transition-all" />
                            </Link>
                            <Link href="https://facebook.com/luraschibikes2">
                                <FaFacebook size={24} className="mr-4 cursor-pointer hover:text-blue-500 transition-all" />
                            </Link>
                        </div>
                    </section>
                    <section className="">
                        CONTACTO
                        ESCRIBINOS POR WHATSAPP
                        <WhatsappButton />
                    </section>
                </section>
            </div>
            <div className='border-t max-w-7xl mx-auto border-slate-600'>
                <p className='pt-5 text-center text-slate-400 font-light text-sm'>
                    © 2025 Luraschi Bikes. Todos los derechos reservados.
                </p>

            </div>
        </footer >
    )
}
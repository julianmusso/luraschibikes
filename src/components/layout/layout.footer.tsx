import { 
    LURASCHI_BIKES_ADDRESS_1, 
    LURASCHI_BIKES_ADDRESS_2, 
    LURASCHI_BIKES_EMAIL,
    LURASCHI_BIKES_FACEBOOK, 
    LURASCHI_BIKES_INSTAGRAM 
} from '@/lib/constants/luraschibikes';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaFacebook } from 'react-icons/fa6'
import { Floating_WhatsappButton, WhatsappGreenButton } from './layout.footer.whatsappbuttons';
import { Footer_RedesSociales_Component } from './layout.footer.redessociales';

export function Footer_Component() {
    return (
        <footer className='bg-slate-800 py-8 border-t border-blue-500'>
            <div className='max-w-7xl mx-auto py-8 px-8 lg:px-0'>
                <section className="grid lg:grid-cols-3 space-y-6">

                    {/* Sección de información de la empresa */}
                    <section className="text-neutral-300 font-light space-y-6">
                        <div className='flex mb-5 tracking-widest'>
                            <Image src="/assets/images/luraschi_icon.png" alt="Logo" width={56} height={56} className='border-2 border-white rounded-full' />
                            <span className='text-white font-light text-2xl my-auto ml-4'>LURASCHI</span>
                            <span className='text-white font-bold text-2xl my-auto ml-3'>BIKES</span>
                        </div>
                        <div>
                            <p>{LURASCHI_BIKES_ADDRESS_1}</p>
                            <p>{LURASCHI_BIKES_ADDRESS_2}</p>
                        </div>
                        <div>
                            <Link href={`mailto:${LURASCHI_BIKES_EMAIL}`}
                                className='underline-2'>
                                {LURASCHI_BIKES_EMAIL}
                            </Link>
                        </div>
                    </section>

                    {/* Sección de enlaces y redes sociales */}
                    <section className="mt-4">
                        <h4 className="font-bold text-white">EXPLORAR</h4>
                        <ul className="text-slate-300 font-light space-y-2 my-4">
                            <li><Link href="/tienda">Catálogo</Link></li>
                            <li><Link href="/ubicacion">Puntos de venta</Link></li>
                            <li><Link href="/contacto">Contacto</Link></li>
                            <li><Link href="/terminos-y-condiciones">Términos y condiciones</Link></li>
                            <li><Link href="/privacidad">Política de privacidad</Link></li>
                        </ul>
                    </section>

                    {/* Sección de contacto */}
                    <section className="mt-4 space-y-3">
                        <h4 className="font-bold text-white">CONTACTO</h4>
                        <p className="text-slate-300 font-light">ESCRIBINOS POR WHATSAPP</p>
                        <WhatsappGreenButton />
                        <Floating_WhatsappButton />

                        <Footer_RedesSociales_Component />
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
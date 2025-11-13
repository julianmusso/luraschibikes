import { LURASCHI_BIKES_INSTAGRAM, LURASCHI_BIKES_FACEBOOK } from '@/lib/constants/luraschibikes';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaMapLocationDot } from 'react-icons/fa6'

export function Footer_RedesSociales_Component() {
    
    return (
        <div className="my-5 flex space-x-4">
            <Link href={LURASCHI_BIKES_INSTAGRAM}>
                <FaInstagram size={26} className="text-white cursor-pointer hover:text-pink-500 transition-all" />
            </Link>
            <Link href={LURASCHI_BIKES_FACEBOOK}>
                <FaFacebook size={24} className="text-white cursor-pointer hover:text-blue-500 transition-all" />
            </Link>
            <Link href="https://maps.app.goo.gl/6xajAy7WaE5ygYxw5">
                <FaMapLocationDot size={24} className="text-white cursor-pointer hover:text-green-500 transition-all" />
            </Link>
        </div>
    )
}
import { getWhatsAppLink } from '@/lib/helpers/whatsapp';
import { FaWhatsapp  } from 'react-icons/fa6'

export function Floating_WhatsappButton() {
    return (
        <a href={getWhatsAppLink()} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
            <button className="cursor-pointer fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all">
                <FaWhatsapp size={24} />
            </button>
        </a>
    );
}

export function WhatsappGreenButton() {
    return (
        <a href={getWhatsAppLink()} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
            <button className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                <div className='flex'>
                    <FaWhatsapp size={20} className='my-auto mr-2' />
                    <span>Escribinos por WhatsApp</span>
                </div>
            </button>
        </a>
    );
}
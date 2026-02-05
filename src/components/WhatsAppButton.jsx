import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = "525547864688";
    const message = "Hola, me interesa realizar una cotización.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle size={28} fill="white" className="group-hover:animate-pulse" />
            <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                Cotizar ahora
            </span>
        </a>
    );
}

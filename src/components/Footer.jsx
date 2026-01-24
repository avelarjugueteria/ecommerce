import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-black text-white pt-16 pb-8 mt-auto border-t-4 border-gray-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <h1 className="font-sans font-black text-xl leading-none text-white tracking-wide uppercase">AVELAR</h1>
                            <p className="text-sm leading-none text-gray-500">jugueterías</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        La pieza que falta en tu negocio. Somos el eslabón logístico entre las grandes marcas y tu punto de venta.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-wider border-b border-gray-700 pb-2 inline-block font-display">Contacto</h3>
                    <ul className="text-sm text-gray-400 space-y-4">
                        <li className="flex items-start gap-4">
                            <div className="bg-gray-800 p-2 rounded text-brand-blue"><MapPin size={16} /></div>
                            <span>Centro Logístico Norte, CDMX.<br /><span className="text-xs text-gray-500">Solo entregas programadas.</span></span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="bg-gray-800 p-2 rounded text-brand-teal"><Phone size={16} /></div>
                            <span>55-1234-5678</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>© 2026 Avelar Jugueterías. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

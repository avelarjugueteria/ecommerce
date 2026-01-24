import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function HeroBanner() {
    return (
        <div className="relative bg-white">
            {/* Main Banner Area */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/assets/banner.png"
                    alt="Avelar Jugueterías Banner"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-blue text-white text-xs font-bold tracking-wider mb-4 uppercase">
                        Distribuidores Oficiales
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg font-display">
                        LAS MEJORES MARCAS<br />
                        <span className="text-brand-yellow">AL MEJOR PRECIO</span>
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md">
                        Abastece tu negocio con los juguetes más buscados de la temporada.
                    </p>
                </div>
            </div>

            {/* Investment Invitation Section (Below Banner) */}
            <div className="bg-brand-black text-white py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 text-brand-teal">
                                <TrendingUp size={24} />
                                <span className="font-bold text-sm uppercase tracking-wider">Oportunidad de Negocio</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                                ¿Buscas iniciar tu propio negocio?
                            </h2>
                            <p className="text-gray-400 text-base leading-relaxed">
                                Únete a nuestra red de emprendedores exitosos. Te ofrecemos asesoría personalizada, márgenes de ganancia competitivos y el respaldo de las marcas líderes del mercado. Inicia hoy mismo con un inventario optimizado para ventas rápidas.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <a href="#contacto" className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg group">
                                Iniciar Ahora
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

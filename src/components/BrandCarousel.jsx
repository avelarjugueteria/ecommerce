import React from 'react';

const BRANDS = [
    { name: "Toy Mark", logo: "https://via.placeholder.com/150x80?text=Toy+Mark" },
    { name: "Mattel", logo: "https://via.placeholder.com/150x80?text=Mattel" },
    { name: "Ruzz", logo: "https://via.placeholder.com/150x80?text=Ruzz" },
    { name: "Novelty", logo: "https://via.placeholder.com/150x80?text=Novelty" },
    { name: "Lego", logo: "https://via.placeholder.com/150x80?text=Lego" },
    { name: "Hasbro", logo: "https://via.placeholder.com/150x80?text=Hasbro" },
    { name: "Funko", logo: "https://via.placeholder.com/150x80?text=Funko" },
    { name: "Spin Master", logo: "https://via.placeholder.com/150x80?text=Spin+Master" },
];

export default function BrandCarousel() {
    return (
        <div className="w-full bg-white py-12 border-b border-gray-100">
            <div className="text-center mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nuestras Marcas</span>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
                    {/* First copy of brands */}
                    {BRANDS.map((brand, index) => (
                        <div key={`brand-1-${index}`} className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                            <span className="text-xl md:text-2xl font-black text-gray-300 uppercase tracking-tighter hover:text-brand-blue transition-colors font-display">{brand.name}</span>
                        </div>
                    ))}
                    {/* Second copy for infinite loop */}
                    {BRANDS.map((brand, index) => (
                        <div key={`brand-2-${index}`} className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                            <span className="text-xl md:text-2xl font-black text-gray-300 uppercase tracking-tighter hover:text-brand-blue transition-colors font-display">{brand.name}</span>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 px-8 ml-[100%]">
                    {/* Third copy (if needed for wider screens/seamless loop backup) */}
                    {BRANDS.map((brand, index) => (
                        <div key={`brand-3-${index}`} className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                            <span className="text-xl md:text-2xl font-black text-gray-300 uppercase tracking-tighter hover:text-brand-blue transition-colors font-display">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

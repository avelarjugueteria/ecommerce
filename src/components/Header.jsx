import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, Phone, FileText, Puzzle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PuzzleLogo = () => (
    <div className="grid grid-cols-2 gap-0.5 w-10 h-10 transform hover:rotate-3 transition-transform duration-300 cursor-pointer">
        <div className="bg-brand-red rounded-tl-lg rounded-br-sm"></div>
        <div className="bg-brand-blue rounded-tr-lg rounded-bl-sm"></div>
        <div className="bg-brand-yellow rounded-bl-lg rounded-tr-sm"></div>
        <div className="bg-brand-teal rounded-br-lg rounded-tl-sm"></div>
    </div>
);

export default function Header({ cartCount, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Top Bar */}
            <div className="w-full bg-brand-black text-white text-xs py-1.5 px-4 flex justify-between items-center hidden md:flex border-b border-gray-800">
                <div className="flex gap-6">

                    <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-pointer"><FileText size={12} /> Catálogo PDF</span>
                </div>
                <div className="flex gap-4 opacity-80">
                    {/* Links removed as per request */}
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-brand-black">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-6">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 cursor-pointer group text-decoration-none">
                            <PuzzleLogo />
                            <div className="flex flex-col">
                                <h1 className="font-display font-black text-3xl leading-none text-brand-black tracking-wide uppercase group-hover:text-brand-blue transition-colors">
                                    AVELAR
                                </h1>
                                <div className="flex items-center">
                                    <p className="font-sans font-bold text-sm leading-none text-gray-500 tracking-wide">jugueterías</p>
                                    <div className="h-[2px] w-full bg-brand-black ml-1 mt-1 opacity-20"></div>
                                </div>
                            </div>
                        </Link>

                        {/* Search */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400 group-focus-within:text-[#2196F3] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Busca por SKU, Marca o Categoría..."
                                onChange={(e) => onSearch && onSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-gray-700"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end leading-tight mr-2 cursor-pointer group">
                                <span className="text-xs font-bold text-gray-900 group-hover:text-[#2196F3]">Distribuidor Oficial</span>
                                <span className="text-[10px] text-gray-500 font-medium">Lego • Mattel • Hasbro</span>
                            </div>

                            <Link to="/cart" className="relative cursor-pointer group">
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-[#F44336] group-hover:bg-red-50 transition-all">
                                    <ShoppingCart size={20} className="text-gray-700 group-hover:text-[#F44336]" />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#D60000] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                className="md:hidden p-2 text-gray-600"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

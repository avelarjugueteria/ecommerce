import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import BrandCarousel from '../components/BrandCarousel';
import { supabase } from '../lib/supabaseClient';
import { Filter, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Home({ onAddToCart, searchTerm }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedBrand, setSelectedBrand] = useState('Todas');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, products, selectedCategory, selectedBrand]);

    const fetchProducts = async () => {
        setLoading(true);
        // Fetch from Supabase
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (!error && data && data.length > 0) {
            setProducts(data);
        } else {
            // Fallback data for prototype if DB is empty or connection fails
            console.warn("Using mock data due to DB error or empty table:", error);
            setProducts(MOCK_PRODUCTS);
        }
        setLoading(false);
    };

    const filterProducts = () => {
        let result = products;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(p =>
                (p.name || p.title || '').toLowerCase().includes(lower) ||
                p.sku.toLowerCase().includes(lower) ||
                p.brand.toLowerCase().includes(lower)
            );
        }

        if (selectedCategory !== 'Todas') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (selectedBrand !== 'Todas') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        setFilteredProducts(result);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Catálogo Avelar Jugueterías", 10, 20);
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, 10, 28);

        let y = 40;
        filteredProducts.forEach((p, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(12);
            doc.text(`${p.sku} - ${p.name || p.title}`, 10, y);
            doc.setFontSize(10);
            doc.text(`Marca: ${p.brand} | Precio Mayoreo: $${p.price || p.wholesale_price}`, 10, y + 5);
            // Images in PDF are tricky without CORS/Proxy, skipping for basic prototype or could add if base64 available
            y += 15;
        });

        doc.save("Catalogo_Avelar.pdf");
    };

    const categories = ['Todas', ...new Set(products.map(p => p.category).filter(Boolean))];
    const brands = ['Todas', ...new Set(products.map(p => p.brand).filter(Boolean))];

    const newProducts = products.slice(0, 4);

    return (
        <div className="bg-[#F8FAFC]">
            <HeroBanner />
            <BrandCarousel />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* New Products Section */}
                {!loading && newProducts.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-1 bg-brand-red rounded-full"></div>
                            <h2 className="text-2xl font-black text-brand-black uppercase tracking-tight">Nuevos Productos</h2>
                            <span className="text-xs font-bold text-brand-red bg-red-50 px-2 py-1 rounded-full border border-red-100">Recién llegados</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newProducts.map(product => (
                                <ProductCard key={`new-${product.id}`} product={product} onAddToCart={onAddToCart} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Filter size={18} /> Filtros</h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Marca</label>
                                <select
                                    className="w-full p-2 border rounded bg-gray-50 text-sm"
                                    value={selectedBrand}
                                    onChange={e => setSelectedBrand(e.target.value)}
                                >
                                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Categoría</label>
                                <select
                                    className="w-full p-2 border rounded bg-gray-50 text-sm"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={generatePDF}
                            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            <FileDown size={18} /> Descargar PDF
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-1 bg-brand-blue rounded-full"></div>
                            <h2 className="text-2xl font-black text-brand-black uppercase tracking-tight">Catálogo Completo</h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Cargando catálogo...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">No se encontraron productos.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id || product.sku} product={product} onAddToCart={onAddToCart} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// MOCK DATA for Fallback
const MOCK_PRODUCTS = [
    { id: 1, sku: 'MAT-001', name: 'Barbie Dreamhouse 2024', brand: 'Mattel', wholesale_price: 2100, stock_quantity: 10, category: 'Muñecas', image_url: 'https://m.media-amazon.com/images/I/71WkD8C6pBL._AC_SX679_.jpg' },
    { id: 2, sku: 'HW-50', name: 'Hot Wheels Pack 50', brand: 'Mattel', wholesale_price: 750, stock_quantity: 0, category: 'Carros', image_url: 'https://m.media-amazon.com/images/I/71Y-tJk-N+L._AC_SX679_.jpg' },
    { id: 3, sku: 'LEGO-484', name: 'LEGO Classic Creative Brick', brand: 'LEGO', wholesale_price: 580, stock_quantity: 100, category: 'Bloques', image_url: 'https://m.media-amazon.com/images/I/8158j89-sSL._AC_SX679_.jpg' },
];

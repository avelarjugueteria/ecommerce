import React from 'react';

const Badge = ({ text, type }) => {
    const colors = {
        brand: "bg-[#FFEB3B] text-black border-yellow-500",
        success: "bg-green-100 text-green-800 border-green-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${colors[type] || colors.info}`}>
            {text}
        </span>
    );
};

export default function ProductCard({ product, onAddToCart }) {
    const isAvailable = product.stock_quantity > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
            <div className="relative pt-[100%] bg-white p-6 border-t-4 border-blue-500">
                <img
                    src={product.image_url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {isAvailable ? (
                        <Badge text="Disponible" type="success" />
                    ) : (
                        <Badge text="Agotado" type="danger" />
                    )}
                    {product.brand && <Badge text={product.brand} type="brand" />}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 border-t border-gray-100 relative">
                <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{product.sku}</div>
                <h3 className="font-bold text-gray-900 leading-tight mb-4 line-clamp-2 min-h-[2.5em] text-[15px]">{product.name}</h3>

                <div className="mt-auto space-y-4">
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Mayoreo</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-bold text-[#1A1A1A]">$</span>
                            <span className="text-xl font-black text-[#1A1A1A]">{product.wholesale_price}</span>
                        </div>
                    </div>

                    <button
                        className={`w-full font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm 
              ${isAvailable
                                ? 'bg-[#D60000] text-white hover:bg-red-700 shadow-red-200 active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        onClick={() => isAvailable && onAddToCart(product)}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Agregar a Cotización' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}

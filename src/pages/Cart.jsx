import React from 'react';
import { ArrowLeft, MessageCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart({ cart, onRemove, onUpdateQty }) {
    const total = cart.reduce((acc, item) => acc + ((item.price || item.wholesale_price) * item.quantity), 0);

    const generateWhatsAppLink = () => {
        const phone = "5215512345678"; // Replace with actual number
        const itemsList = cart.map(item => `• (${item.quantity}pz) ${item.sku} - ${item.name || item.title}`).join('%0A');
        const message = `Hola Avelar, quiero cotizar este pedido:%0A%0A${itemsList}%0A%0ATotal Estimado: $${total.toLocaleString()}%0A%0A¿Me confirman existencias?`;
        return `https://wa.me/${phone}?text=${message}`;
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Tu cotización está vacía</h2>
                <Link to="/" className="text-[#D60000] hover:underline font-bold">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black mb-8">
                <ArrowLeft size={16} /> Volver
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-4">Solicitud de Cotización</h2>
                    {cart.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-center">
                            <img src={item.image_url || item.main_image_url || 'https://via.placeholder.com/100'} className="w-20 h-20 object-contain bg-gray-50 rounded" />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 line-clamp-1">{item.name || item.title}</h4>
                                <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                                <div className="text-sm font-bold text-[#1A1A1A] mt-1">${item.price || item.wholesale_price}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value) || 1)}
                                    className="w-16 border rounded p-1 text-center font-bold"
                                />
                                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-80 h-fit bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-gray-600 font-bold">Total Estimado</span>
                        <span className="text-2xl font-black text-[#1A1A1A]">${total.toLocaleString()}</span>
                    </div>

                    <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                        <MessageCircle size={20} />
                        Solicitar por WhatsApp
                    </a>
                    <p className="text-xs text-center text-gray-400 mt-4">
                        Al dar click se abrirá tu WhatsApp con el lista de productos precargada.
                    </p>
                </div>
            </div>
        </div>
    );
}

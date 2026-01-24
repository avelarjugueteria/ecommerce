import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.sku === product.sku);
      if (existing) {
        return prev.map(p => p.sku === product.sku ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header cartCount={cart.length} onSearch={setSearchTerm} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} searchTerm={searchTerm} />} />
          <Route path="/cart" element={<Cart cart={cart} onRemove={handleRemoveFromCart} onUpdateQty={handleUpdateQty} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;

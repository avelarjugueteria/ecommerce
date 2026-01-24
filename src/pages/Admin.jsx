import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabaseClient';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState([]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setLog([]);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                addLog(`Leídas ${data.length} filas del archivo.`);

                for (const row of data) {
                    // Mapping Excel columns to DB columns
                    // Expected Excel headers: sku, name, brand, price, stock, category, image
                    const product = {
                        sku: row.sku,
                        name: row.name,
                        brand: row.brand,
                        wholesale_price: row.price,
                        stock_quantity: row.stock,
                        category: row.category,
                        image_url: row.image,
                        active: true
                    };

                    if (!product.sku) {
                        addLog(`Error: Fila sin SKU ignorada.`, 'error');
                        continue;
                    }

                    // Upsert to Supabase
                    const { error } = await supabase
                        .from('products')
                        .upsert(product, { onConflict: 'sku' });

                    if (error) {
                        addLog(`Error al subir ${product.sku}: ${error.message}`, 'error');
                    } else {
                        // addLog(`Producto ${product.sku} actualizado.`, 'success');
                    }
                }
                addLog('Proceso completado.');
            } catch (err) {
                addLog(`Error general: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const addLog = (msg, type = 'info') => {
        setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black text-[#1A1A1A] mb-8">Administración de Inventario</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Upload size={20} /> Carga Masiva (Excel/CSV)</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Sube un archivo .xlsx con las columnas: <code>sku, name, brand, price, stock, category, image</code>.
                    Los productos existentes (por SKU) se actualizarán, los nuevos se crearán.
                </p>

                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {loading && <div className="mt-4 text-blue-600 font-bold animate-pulse">Procesando archivo...</div>}
            </div>

            <div className="bg-gray-900 text-gray-300 p-6 rounded-xl font-mono text-xs h-64 overflow-y-auto">
                {log.length === 0 ? <span className="opacity-50">Log de operaciones aparecerá aquí...</span> :
                    log.map((l, i) => (
                        <div key={i} className={`mb-1 ${l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-green-400' : ''}`}>
                            [{l.time}] {l.msg}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

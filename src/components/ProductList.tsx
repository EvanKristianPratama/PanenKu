import React, { useMemo, useState } from 'react';

export type Product = {
    id: number | string;
    name: string;
    price?: number;
    unit?: string;
    image?: string;
    category?: string;
    description?: string;
    stock?: number;
    farmer?: string;
    location?: string;
};

export const ProductList: React.FC<{ products?: Product[] }> = ({ products = [] }) => {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');

    const categories = useMemo(() => {
        const cats = new Set<string>();
        products.forEach((p) => {
            if (p.category) cats.add(p.category);
        });
        return Array.from(cats);
    }, [products]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products.filter((p) => {
            if (activeCategory !== 'Semua' && p.category !== activeCategory) return false;
            if (!q) return true;
            return p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
        });
    }, [products, query, activeCategory]);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <input
                    aria-label="search"
                    placeholder="Cari produk..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border px-2 py-1"
                />
            </div>

            <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveCategory('Semua')}>Semua</button>
                {categories.map((c) => (
                    <button key={c} onClick={() => setActiveCategory(c)}>
                        {c}
                    </button>
                ))}
            </div>

            <div className="mb-2">Menampilkan {filtered.length} produk</div>

            {filtered.length === 0 ? (
                <div>Tidak ada produk yang ditemukan</div>
            ) : (
                <ul>
                    {filtered.map((p) => (
                        <li key={p.id}>{p.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;

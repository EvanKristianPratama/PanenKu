'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Input } from './ui/input';
import { Search, X, ChevronLeft, ChevronRight, Flame, Sparkles, LayoutGrid } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';

interface ProductShowcaseProps {
    products: Product[];
}

// ============================================================
// SEARCH & FILTER SECTION
// ============================================================
interface SearchFilterProps {
    search: string;
    setSearch: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    categories: string[];
    productCount: number;
    filteredCount: number;
}

function SearchFilter({ search, setSearch, category, setCategory, categories, productCount, filteredCount }: SearchFilterProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Cari produk, kategori, atau petani..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-0 rounded-xl text-base w-full"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat === 'all' ? 'Semua' : cat}
                    </button>
                ))}
            </div>

            {/* Result Count */}
            {(search || category !== 'all') && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold text-gray-900">{filteredCount}</span> dari {productCount} produk
                    </p>
                    <button
                        onClick={() => { setSearch(''); setCategory('all'); }}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// CAROUSEL SECTION (Reusable)
// ============================================================
interface CarouselSectionProps {
    title: string;
    subtitle: string;
    products: Product[];
    icon: React.ReactNode;
    iconBg: string;
}

export function CarouselSection({ title, subtitle, products, icon, iconBg }: CarouselSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white shadow border flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white shadow border flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map(product => (
                    <div key={product.id} className="flex-none w-[280px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================
// ALL PRODUCTS GRID
// ============================================================
interface ProductGridSectionProps {
    products: Product[];
}

function ProductGridSection({ products }: ProductGridSectionProps) {
    if (products.length === 0) return null;

    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Semua Produk</h3>
                    <p className="text-sm text-gray-500">{products.length} produk tersedia</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT: ProductShowcase
// Order: Filter → Best Seller → New → All Products
// ============================================================
export function ProductShowcase({ products }: ProductShowcaseProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    // Unique categories
    const categories = useMemo(() => {
        return ['all', ...Array.from(new Set(products.map(p => p.category)))];
    }, [products]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const s = search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s) ||
                p.farmer.toLowerCase().includes(s)
            );
        }

        if (category !== 'all') {
            result = result.filter(p => p.category === category);
        }

        return result;
    }, [products, search, category]);

    // Best sellers from filtered
    const bestSellers = useMemo(() => {
        return [...filteredProducts]
            .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
            .slice(0, 10);
    }, [filteredProducts]);

    // Newest from filtered
    const newestProducts = useMemo(() => {
        return [...filteredProducts]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 10);
    }, [filteredProducts]);

    return (
        <div id="products" className="bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                {/* 1. FILTER */}
                <SearchFilter
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    categories={categories}
                    productCount={products.length}
                    filteredCount={filteredProducts.length}
                />

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-2">Tidak ada produk ditemukan</p>
                        <p className="text-gray-400 mb-4">Coba kata kunci atau kategori lain</p>
                        <button
                            onClick={() => { setSearch(''); setCategory('all'); }}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <>
                        {/* 2. BEST SELLER */}
                        <CarouselSection
                            title="Best Seller"
                            subtitle="Produk paling laris"
                            products={bestSellers}
                            icon={<Flame className="w-5 h-5 text-orange-600" />}
                            iconBg="bg-orange-100"
                        />

                        {/* 3. PRODUK TERBARU */}
                        <CarouselSection
                            title="Produk Terbaru"
                            subtitle="Baru ditambahkan"
                            products={newestProducts}
                            icon={<Sparkles className="w-5 h-5 text-purple-600" />}
                            iconBg="bg-purple-100"
                        />

                        {/* 4. SEMUA PRODUK */}
                        <ProductGridSection products={filteredProducts} />
                    </>
                )}
            </div>
        </div>
    );
}

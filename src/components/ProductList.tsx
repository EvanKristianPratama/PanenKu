'use client';

import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Grid3X3, LayoutList } from 'lucide-react';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="products" className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Produk Kami</h2>
            <p className="text-gray-500">Pilihan produk segar langsung dari petani lokal</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className={category === cat
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-white hover:bg-gray-50'}
            >
              {cat === 'all' ? 'Semua' : cat}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Menampilkan {filteredProducts.length} produk
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci atau kategori lain</p>
          </div>
        )}
      </div>
    </div>
  );
}

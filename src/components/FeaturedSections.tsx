'use client';

import { Product } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface FeaturedSectionsProps {
    products: Product[];
    userName: string;
}

function ProductCarousel({
    title,
    subtitle,
    products,
    icon: Icon,
    accentColor
}: {
    title: string;
    subtitle: string;
    products: Product[];
    icon: any;
    accentColor: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success(`${product.name} ditambahkan ke keranjang`);
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${accentColor} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex-shrink-0 w-[280px]"
                    >
                        <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                        {product.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-green-600">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-gray-400">per {product.unit}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 h-9 px-3"
                                        onClick={(e) => handleAddToCart(product, e)}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function FeaturedSections({ products, userName }: FeaturedSectionsProps) {
    // Get different product sets
    const newProducts = [...products].reverse().slice(0, 6); // Latest products
    const bestSellers = [...products].slice(0, 6); // Assuming first products are best sellers

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 pt-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="text-white z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
                                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                {getGreeting()}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                Hai, {userName}! 👋
                            </h1>
                            <p className="text-xl text-green-100 mb-6 max-w-lg">
                                Temukan produk pertanian segar langsung dari petani lokal untuk kebutuhanmu hari ini
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/orders">
                                    <Button className="bg-white text-green-700 hover:bg-green-50 h-12 px-6">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Pesanan Saya
                                    </Button>
                                </Link>
                                <Link href="/cart">
                                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/50 h-12 px-6">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Keranjang
                                    </Button>
                                </Link>
                            </div>

                            {/* Quick Stats Inline */}
                            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/20">
                                <div>
                                    <p className="text-3xl font-bold">{products.length}+</p>
                                    <p className="text-sm text-green-200">Produk</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">50+</p>
                                    <p className="text-sm text-green-200">Petani</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">Free</p>
                                    <p className="text-sm text-green-200">Ongkir</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">4.9⭐</p>
                                    <p className="text-sm text-green-200">Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Main Image */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800"
                                        alt="Fresh vegetables"
                                        className="w-full h-[350px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">🥬</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Segar 100%</p>
                                            <p className="text-sm text-gray-500">Dari petani</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">🚚</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Gratis Ongkir</p>
                                            <p className="text-sm text-gray-500">Semua order</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white rounded-2xl p-3 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">⭐</span>
                                        <span className="font-bold text-gray-900">4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                {/* New Products Carousel */}
                <ProductCarousel
                    title="Produk Terbaru"
                    subtitle="Baru ditambahkan minggu ini"
                    products={newProducts}
                    icon={Sparkles}
                    accentColor="bg-blue-500"
                />

                {/* Best Seller Carousel */}
                <ProductCarousel
                    title="Best Seller"
                    subtitle="Produk paling diminati"
                    products={bestSellers}
                    icon={TrendingUp}
                    accentColor="bg-orange-500"
                />
            </div>
        </div>
    );
}

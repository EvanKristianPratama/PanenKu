'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, TrendingUp, Clock, Leaf, Truck, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface FeaturedSectionsProps {
    products: Product[];
    userName: string;
}

// Hero images for carousel
const heroImages = [
    {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
    },
    {
        url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800',
    },
    {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
    },
    {
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800',
    },
];

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
        addToCart(product, 1);
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
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('left')}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('right')}>
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
                    <Link key={product.id} href={`/product/${product.id}`}>
                        <Card className="min-w-[280px] max-w-[280px] border-0 shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden">
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
    const [currentImage, setCurrentImage] = useState(0);

    // Get different product sets
    const newProducts = [...products].reverse().slice(0, 6);
    const bestSellers = [...products].slice(0, 6);

    // Auto-rotate images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

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
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left Content */}
                        <div className="text-white z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                {getGreeting()}
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Hai, {userName}! 👋
                            </h1>

                            <p className="text-lg text-white/80 mb-8 max-w-md">
                                Temukan produk pertanian segar langsung dari petani lokal terpercaya
                            </p>

                            <div className="flex flex-wrap gap-3 mb-10">
                                <Link href="/orders">
                                    <Button className="bg-white text-green-700 hover:bg-white/90 h-11 px-5 shadow-lg">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Pesanan Saya
                                    </Button>
                                </Link>
                                <Link href="/cart">
                                    <Button variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10 h-11 px-5">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Keranjang
                                    </Button>
                                </Link>
                            </div>

                            {/* Quick Stats Inline */}
                            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
                                <div>
                                    <p className="text-3xl font-bold">{products.length}+</p>
                                    <p className="text-sm text-white/70">Produk</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">50+</p>
                                    <p className="text-sm text-white/70">Petani</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">Free</p>
                                    <p className="text-sm text-white/70">Ongkir</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">4.9⭐</p>
                                    <p className="text-sm text-white/70">Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Carousel */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Image Container */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[380px]">
                                    {heroImages.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.url}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${index === currentImage
                                                ? 'opacity-100 scale-100'
                                                : 'opacity-0 scale-105'
                                                }`}
                                        />
                                    ))}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* Image Title */}
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-white font-medium text-lg">
                                            heroImages
                                        </p>
                                    </div>
                                </div>

                                {/* Image Indicators */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {heroImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImage(index)}
                                            className={`h-2 rounded-full transition-all duration-300 ${index === currentImage
                                                ? 'w-8 bg-white'
                                                : 'w-2 bg-white/40 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-3 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">100% Fresh</p>
                                            <p className="text-xs text-gray-500">Organik</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-2 -right-4 bg-white rounded-2xl p-3 shadow-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Free Ongkir</p>
                                            <p className="text-xs text-gray-500">Semua Order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
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

'use client';

import { Button } from './ui/button';
import { Sprout, Truck, ShieldCheck, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Data with colors for each type
const PRODUCT_TYPES = [
    { text: 'Pertanian', color: 'text-green-600' },
    { text: 'Peternakan', color: 'text-amber-600' },
    { text: 'Perikanan', color: 'text-blue-600' },
    { text: 'Perkebunan', color: 'text-emerald-600' },
];

const PRODUCER_TYPES = [
    { text: 'Petani', color: 'text-orange-500' },
    { text: 'Peternak', color: 'text-rose-500' },
    { text: 'Nelayan', color: 'text-cyan-500' },
    { text: 'Pekebun', color: 'text-lime-600' },
];

export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setIsVisible(false);

            // After fade out, change text and fade in
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % PRODUCT_TYPES.length);
                setIsVisible(true);
            }, 400);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const scrollToProducts = () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    const currentProduct = PRODUCT_TYPES[currentIndex];
    const currentProducer = PRODUCER_TYPES[currentIndex];

    return (
        <div className="relative overflow-hidden bg-white pt-16">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-100/50 to-transparent" />

            <div className="relative container mx-auto px-4 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                            <Leaf className="w-4 h-4" />
                            Produk Segar Berkualitas
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Belanja Produk
                            {/* Fixed width container to prevent layout shift */}
                            <span className="block h-[1.2em] relative overflow-hidden">
                                <span
                                    className={`${currentProduct.color} absolute left-0 transition-all duration-500 ease-out ${isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 -translate-y-6'
                                        }`}
                                >
                                    {currentProduct.text}
                                </span>
                            </span>
                            <span className="text-gray-900">Langsung dari </span>
                            {/* Fixed width for producer text */}
                            <span className="inline-block w-[200px] lg:w-[260px] relative overflow-hidden h-[1.2em] align-bottom">
                                <span
                                    className={`${currentProducer.color} absolute left-0 transition-all duration-500 ease-out ${isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-6'
                                        }`}
                                >
                                    {currentProducer.text}
                                </span>
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-lg">
                            Dapatkan sayuran, buah-buahan, dan produk pertanian segar dengan harga terjangkau langsung dari petani lokal.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={scrollToProducts}
                                className="h-12 px-8 bg-green-600 hover:bg-green-700 text-lg shadow-lg shadow-green-500/25"
                            >
                                Lihat Produk
                            </Button>
                            <Link href="/register">
                                <Button variant="outline" className="h-12 px-8 text-lg border-2">
                                    Daftar Gratis
                                </Button>
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Truck className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Gratis Ongkir</p>
                                <p className="text-xs text-gray-500">Semua pesanan</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <ShieldCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">100% Segar</p>
                                <p className="text-xs text-gray-500">Jaminan kualitas</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Sprout className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Petani Lokal</p>
                                <p className="text-xs text-gray-500">Dukung UMKM</p>
                            </div>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl transform rotate-6 scale-95 opacity-20" />
                        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"
                                alt="Fresh vegetables"
                                className="w-full h-[400px] object-cover rounded-2xl"
                            />

                            {/* Floating Card - Products */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🥬</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">100+ Produk</p>
                                        <p className="text-sm text-gray-500">Tersedia</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card - Farmers */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float-delayed">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">👨‍🌾</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">50+ Petani</p>
                                        <p className="text-sm text-gray-500">Terpercaya</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smooth floating animation CSS */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                
                :global(.animate-float) {
                    animation: float 4s ease-in-out infinite;
                }
                
                :global(.animate-float-delayed) {
                    animation: float 4s ease-in-out infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}

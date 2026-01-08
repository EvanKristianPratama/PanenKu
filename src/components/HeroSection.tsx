'use client';

import { Button } from './ui/button';
import { Sprout, Truck, ShieldCheck, Leaf } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    const scrollToProducts = () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative overflow-hidden bg-white">
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
                            <span className="text-green-600"> Pertanian</span>
                            <br />Langsung dari Petani
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
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
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
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
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
        </div>
    );
}

'use client';

import { Product } from '@/types';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { useCartActions } from '@/hooks/useCartActions';

interface BestProductCarouselProps {
    products: Product[];
}

export function BestProductCarousel({ products }: BestProductCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { addToCart, isLoading } = useCartActions();

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);

        // Auto-play
        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);

        return () => {
            emblaApi.off('select', onSelect);
            clearInterval(autoplay);
        };
    }, [emblaApi, onSelect]);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product);
        addToCart(product);
    };

    // Get top 4 products for carousel
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-4">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        Produk Terbaik Minggu Ini
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Best Seller</h2>
                    <p className="text-white/80">Produk pilihan dari petani terbaik</p>
                </div>

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                                        <div className="relative aspect-[4/3]">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                🔥 Best Seller
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">per {product.unit}</p>
                                                </div>
                                                <Button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Beli
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10 transition-all"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {featuredProducts.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${index === selectedIndex ? 'bg-white w-8' : 'bg-white/40'
                                }`}
                            onClick={() => emblaApi?.scrollTo(index)}
                        />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <Link href="/">
                        <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30">
                            Lihat Semua Produk →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

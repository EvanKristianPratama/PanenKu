'use client';

import { ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartPreviewProps {
    isScrolled?: boolean;
    isLoggedIn?: boolean;
}

export function CartPreview({ isScrolled = false, isLoggedIn = false }: CartPreviewProps) {
    const { cartItems, cartCount, removeFromCart } = useCart();
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`relative transition-colors ${isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : isLoggedIn ? 'text-white hover:bg-white/20' : 'text-green-700 hover:text-green-900 hover:bg-green-100'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[350px] sm:w-[400px] p-0">
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                            Keranjang ({cartCount})
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-180px)]">
                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4">Keranjang masih kosong</p>
                            <SheetClose asChild>
                                <Link href="/">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        Mulai Belanja
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                                        <ImageWithFallback
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
                                            <p className="text-xs text-gray-500">{item.quantity} × {item.product.unit}</p>
                                            <p className="text-sm font-semibold text-green-600 mt-1">
                                                Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                                            onClick={() => removeFromCart(String(item.product.id))}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t p-4 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-green-600">
                                        Rp {total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <SheetClose asChild>
                                    <Link href="/cart" className="block">
                                        <Button className="w-full bg-green-600 hover:bg-green-700">
                                            Lihat Keranjang
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

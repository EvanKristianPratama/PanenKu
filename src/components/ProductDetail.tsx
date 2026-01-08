'use client';

import { Product } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, MapPin, User, Package, ShoppingCart, Minus, Plus, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!session) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Produk
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Truck className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-xs text-gray-600">Gratis Ongkir</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-xs text-gray-600">Kualitas Terbaik</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Package className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-xs text-gray-600">Segar</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-3">{product.category}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-green-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                <span className="text-gray-500">/ {product.unit}</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Jumlah</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Stok: <span className="font-medium text-green-600">{product.stock} {product.unit}</span>
                  </span>
                </div>
              </div>

              {/* Total & Add to Cart */}
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Harga</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rp {(product.price * quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg font-medium shadow-xl shadow-green-500/25 rounded-xl"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>
            </div>

            {/* Farmer Info */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Informasi Petani</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nama Petani</p>
                      <p className="font-medium">{product.farmer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lokasi</p>
                      <p className="font-medium">{product.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

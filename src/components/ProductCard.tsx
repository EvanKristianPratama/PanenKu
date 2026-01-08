'use client';

import { Product } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, User, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function ProductCard({ product, isNew, isBestSeller }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    addToCart(product);
  };

  // Check if product is new (created within last 7 days)
  const checkIsNew = () => {
    if (isNew !== undefined) return isNew;
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Check if best seller (soldCount > 10)
  const checkIsBestSeller = () => {
    if (isBestSeller !== undefined) return isBestSeller;
    return (product.soldCount || 0) >= 10;
  };

  const showNewLabel = checkIsNew();
  const showBestSellerLabel = checkIsBestSeller();

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group border-0 shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Labels Container */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {showNewLabel && (
              <Badge className="bg-blue-500/90 hover:bg-blue-600/90 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Baru
              </Badge>
            )}
            {showBestSellerLabel && (
              <Badge className="bg-orange-500/90 hover:bg-orange-600/90 backdrop-blur-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Terlaris
              </Badge>
            )}
          </div>

          <Badge className="absolute top-3 right-3 bg-green-500/90 hover:bg-green-600/90 backdrop-blur-sm">
            {product.category}
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              Stok terbatas: {product.stock}
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">Stok Habis</span>
            </div>
          )}
        </div>

        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
          <p className="text-green-600 font-bold text-xl">
            Rp {product.price.toLocaleString('id-ID')}
            <span className="text-sm text-gray-400 font-normal"> / {product.unit}</span>
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex flex-col gap-1.5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-green-500" />
              <span>{product.farmer}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-green-500" />
              <span>{product.location}</span>
            </div>
            {(product.soldCount || 0) > 0 && (
              <div className="text-orange-500 font-medium">
                {product.soldCount} terjual
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

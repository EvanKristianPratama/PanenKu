import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/constants/config';

// ============================================
// Types
// ============================================
export interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isBestSeller?: boolean;
  onAddToCart?: (e: React.MouseEvent) => void;
  isAddingToCart?: boolean;
}

// ============================================
// Helper Functions (pure, no hooks)
// ============================================
const checkIsNew = (product: Product, isNewProp?: boolean): boolean => {
  if (isNewProp !== undefined) return isNewProp;
  if (!product.createdAt) return false;
  const createdDate = new Date(product.createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= APP_CONFIG.NEW_PRODUCT_DAYS;
};

const checkIsBestSeller = (product: Product, isBestSellerProp?: boolean): boolean => {
  if (isBestSellerProp !== undefined) return isBestSellerProp;
  return (product.soldCount || 0) >= APP_CONFIG.BEST_SELLER_THRESHOLD;
};

// ============================================
// Component (Presentational - NO HOOKS)
// ============================================
export function ProductCard({ 
  product, 
  isNew, 
  isBestSeller,
  onAddToCart,
  isAddingToCart = false,
}: ProductCardProps) {
  const showNewLabel = checkIsNew(product, isNew);
  const showBestSellerLabel = checkIsBestSeller(product, isBestSeller);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= APP_CONFIG.LOW_STOCK_THRESHOLD && product.stock > 0;

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group border-0 shadow-md">
        {/* Image Section */}
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
          {isLowStock && (
            <div className="absolute bottom-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              Stok terbatas: {product.stock}
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">Stok Habis</span>
            </div>
          )}
        </div>

        {/* Content Section */}
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

        {/* Footer Section */}
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25 disabled:opacity-50"
            onClick={onAddToCart}
            disabled={isOutOfStock || isAddingToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Stok Habis' : isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

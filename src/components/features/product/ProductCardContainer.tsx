'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { useCartActions } from '@/hooks/useCartActions';
import { Product } from '@/types';

// ============================================
// Types
// ============================================
interface ProductCardContainerProps {
  product: Product;
  isNew?: boolean;
  isBestSeller?: boolean;
}

// ============================================
// Container Component (with hooks & logic)
// ============================================
export function ProductCardContainer({ 
  product, 
  isNew, 
  isBestSeller 
}: ProductCardContainerProps) {
  const { addToCart, isLoading } = useCartActions();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
  };

  return (
    <ProductCard
      product={product}
      isNew={isNew}
      isBestSeller={isBestSeller}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAdding || isLoading}
    />
  );
}

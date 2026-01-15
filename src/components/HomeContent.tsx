'use client';

import { Product } from '@/types';
import { HeroSection } from './HeroSection';
import { FeaturedSections } from './FeaturedSections';
import { ProductShowcase } from './ProductShowcase';
import { useAuth } from '@/hooks/useAuth';

interface HomeContentProps {
    products: Product[];
}

export function HomeContent({ products }: HomeContentProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Loading state
    if (isLoading) {
        return (
            <>
                <HeroSection />
                <ProductShowcase products={products} />
            </>
        );
    }

    // Logged in - show FeaturedSections (personalized hero) + ProductShowcase
    if (isAuthenticated && user) {
        return (
            <>
                <FeaturedSections products={products} userName={user.name || 'User'} />
                <ProductShowcase products={products} />
            </>
        );
    }

    // Guest - show HeroSection + ProductShowcase
    return (
        <>
            <HeroSection />
            <ProductShowcase products={products} />
        </>
    );
}

'use client';

import { Product } from '@/types';
import { HeroSection } from './HeroSection';
import { FeaturedSections } from './FeaturedSections';
import { ProductList } from './ProductList';
import { useSession } from 'next-auth/react';

interface HomeContentProps {
    products: Product[];
}

export function HomeContent({ products }: HomeContentProps) {
    const { data: session, status } = useSession();

    // Show loading state briefly
    if (status === 'loading') {
        return (
            <>
                <HeroSection />
                <ProductList products={products} />
            </>
        );
    }

    // Logged in view
    if (session?.user) {
        return (
            <>
                <FeaturedSections products={products} userName={session.user.name || 'User'} />
                <ProductList products={products} />
            </>
        );
    }

    // Guest view
    return (
        <>
            <HeroSection />
            <ProductList products={products} />
        </>
    );
}

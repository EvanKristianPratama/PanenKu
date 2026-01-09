'use client';

import { Product } from '@/types';
import { HeroSection } from './HeroSection';
import { FeaturedSections } from './FeaturedSections';
import { ProductShowcase } from './ProductShowcase';
import { useSession } from 'next-auth/react';

interface HomeContentProps {
    products: Product[];
}

export function HomeContent({ products }: HomeContentProps) {
    const { data: session, status } = useSession();

    // Loading state
    if (status === 'loading') {
        return (
            <>
                <HeroSection />
                <ProductShowcase products={products} />
            </>
        );
    }

    // Logged in - show FeaturedSections (personalized hero) + ProductShowcase
    if (session?.user) {
        return (
            <>
                <FeaturedSections products={products} userName={session.user.name || 'User'} />
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

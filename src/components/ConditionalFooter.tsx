'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';

const hiddenFooterPaths = ['/login', '/register'];

export function ConditionalFooter() {
    const pathname = usePathname();

    if (hiddenFooterPaths.includes(pathname)) {
        return null;
    }

    return <Footer />;
}

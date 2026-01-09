import { mongoService } from '@/services/mongoService';
import { HomeContent } from '@/components/HomeContent';

export const revalidate = 0; // Disable cache for this page to always show new products

export default async function Home() {
    const products = await mongoService.getProducts();

    return (
        <main className="min-h-screen bg-white">
            <HomeContent products={products} />
        </main>
    );
}


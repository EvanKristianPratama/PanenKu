import { mongoService } from '@/services/mongoService';
import { HomeContent } from '@/components/HomeContent';

export default async function Home() {
    const products = await mongoService.getProducts();

    return (
        <main className="min-h-screen bg-white">
            <HomeContent products={products} />
        </main>
    );
}


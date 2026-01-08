import { mongoService } from '@/services/mongoService';
import { Navbar } from '@/components/Navbar';
import { HomeContent } from '@/components/HomeContent';

export default async function Home() {
    const products = await mongoService.getProducts();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <HomeContent products={products} />
        </main>
    );
}


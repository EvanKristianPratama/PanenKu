import { mongoService } from '@/services/mongoService';
import { Navbar } from '@/components/Navbar';
import { HomeContent } from '@/components/HomeContent';

export default async function Home() {
    const products = await mongoService.getProducts();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <HomeContent products={products} />

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🌱</span>
                                </div>
                                <span className="text-xl font-bold">PanenKu</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Marketplace produk pertanian segar langsung dari petani lokal Indonesia.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Produk</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>Sayuran</li>
                                <li>Buah-buahan</li>
                                <li>Beras</li>
                                <li>Rempah</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Bantuan</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>Cara Belanja</li>
                                <li>Pengiriman</li>
                                <li>Pengembalian</li>
                                <li>FAQ</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Kontak</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>📧 hello@panenku.id</li>
                                <li>📱 +62 812 3456 7890</li>
                                <li>📍 Jakarta, Indonesia</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        © 2024 PanenKu. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}

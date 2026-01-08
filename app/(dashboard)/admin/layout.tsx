import Link from 'next/link';
import { LayoutDashboard, Package, Users, LogOut, ShoppingCart } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if ((session?.user as any)?.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2 text-green-600">
                        <LayoutDashboard className="w-8 h-8" />
                        <span className="text-xl font-bold">PanenKu Admin</span>
                    </Link>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Pesanan
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                        <Package className="w-5 h-5" />
                        Produk
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Pengguna
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-8">
                        <LogOut className="w-5 h-5" />
                        Kembali ke Toko
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

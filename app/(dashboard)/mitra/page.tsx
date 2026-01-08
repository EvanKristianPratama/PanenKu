'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function MitraDashboard() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState({ products: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchStats();
        }
    }, [status]);

    const fetchStats = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch('/api/farmer/products'),
                fetch('/api/farmer/orders')
            ]);
            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();

            setStats({
                products: productsData.products?.length || 0,
                orders: ordersData.orders?.length || 0
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session || (session.user as any).role !== 'farmer') {
        redirect('/');
    }

    const farmerName = session.user?.name || 'Petani';

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-1">Halo, {farmerName}! 👋</h1>
                <p className="text-green-100">Selamat datang di Dashboard Mitra PanenKu</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
                                <p className="text-xs text-gray-500">Total Produk</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                                <p className="text-xs text-gray-500">Pesanan Aktif</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="font-bold text-gray-800">Aksi Cepat</h2>
                <div className="grid gap-3">
                    <Link href="/mitra/products">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Tambah Produk</p>
                                        <p className="text-sm text-gray-500">Jual hasil panen baru</p>
                                    </div>
                                </div>
                                <span className="text-gray-300">→</span>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/mitra/orders">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Kelola Pesanan</p>
                                        <p className="text-sm text-gray-500">Update status pengiriman</p>
                                    </div>
                                </div>
                                <span className="text-gray-300">→</span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}

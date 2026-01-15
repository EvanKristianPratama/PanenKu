'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, CheckCircle, Truck, Clock, XCircle, ShoppingBag, Search, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    unit: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package },
    shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const TABS = [
    { id: 'all', label: 'Semua' },
    { id: 'unpaid', label: 'Belum Bayar' },
    { id: 'processing', label: 'Sedang Diproses' },
    { id: 'shipped', label: 'Dikirim' },
    { id: 'delivered', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' },
];

function OrdersList() {
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const successOrder = searchParams.get('success');

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            fetchOrders();
        }
    }, [sessionStatus]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Advanced Filtering Logic
    const filteredOrders = orders.filter(order => {
        // 1. Text Search Filter (Order ID or Product Name)
        const matchesSearch = searchQuery === '' ||
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        // 2. Tab Status Filter
        switch (activeTab) {
            case 'unpaid':
                return (!order.paymentStatus || order.paymentStatus === 'unpaid' || order.paymentStatus === 'pending_verification') && order.status !== 'cancelled';
            case 'processing':
                return order.status === 'processing' || order.status === 'pending';
            case 'shipped':
                return order.status === 'shipped';
            case 'delivered':
                return order.status === 'delivered';
            case 'cancelled':
                return order.status === 'cancelled' || order.paymentStatus === 'rejected';
            case 'all':
            default:
                return true;
        }
    });

    if (sessionStatus === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (sessionStatus === 'unauthenticated') {
        redirect('/login');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola dan pantau status pesanan Anda</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Cari pesanan..."
                        className="pl-9 bg-white border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Success message */}
            {successOrder && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Pesanan berhasil dibuat!</p>
                        <p className="text-sm text-green-600">Nomor pesanan: <span className="font-mono font-semibold">{successOrder}</span></p>
                    </div>
                </div>
            )}

            {/* Modern Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 min-w-[100px] py-3 px-4 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                                    isActive
                                        ? "border-green-600 text-green-600 bg-green-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 border-dashed">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-medium text-lg mb-1">
                        {orders.length === 0 ? 'Belum ada pesanan' : 'Tidak ada pesanan yang cocok'}
                    </p>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        {orders.length === 0
                            ? 'Mulai belanja produk segar langsung dari petani lokal sekarang!'
                            : 'Coba ubah kata kunci pencarian atau filter status pesanan Anda.'}
                    </p>
                    {orders.length === 0 ? (
                        <Link href="/">
                            <Button className="bg-green-600 hover:bg-green-700 rounded-xl px-6">
                                Mulai Belanja
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                            className="rounded-xl"
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const statusInfo = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={order._id} className="border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
                                <CardContent className="p-0">
                                    {/* Order Header */}
                                    <div className="bg-gray-50/50 p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center shadow-sm">
                                                <ShoppingBag className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                                                    <span className="text-gray-300">•</span>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {order.paymentStatus === 'paid' ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                                            Lunas
                                                        </span>
                                                    ) : order.paymentStatus === 'pending_verification' ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                                                            Verifikasi
                                                        </span>
                                                    ) : order.paymentStatus === 'rejected' ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                                                            Ditolak
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                                            Belum Bayar
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Badge className={`px-3 py-1.5 rounded-lg border-0 ${statusInfo.color} flex items-center gap-1.5`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {statusInfo.label}
                                        </Badge>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4">
                                        <div className="flex flex-col gap-3">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                                                        <p className="text-sm text-gray-500 mt-0.5">
                                                            {item.quantity} {item.unit} × Rp {item.price.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {order.items.length > 2 && (
                                            <button className="text-xs font-medium text-gray-500 hover:text-green-600 mt-3 pl-20 transition-colors">
                                                + {order.items.length - 2} produk lainnya...
                                            </button>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="px-4 py-3 bg-gray-50/30 flex items-center justify-between border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500">Total Belanja</p>
                                            <p className="text-base font-bold text-gray-900">
                                                Rp {order.totalAmount.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/orders/${order._id}`}>
                                                <Button variant="outline" size="sm" className="rounded-lg h-9 bg-white hover:bg-gray-50">
                                                    Detail
                                                </Button>
                                            </Link>

                                            {(!order.paymentStatus || order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected' || order.paymentStatus === 'pending_verification') && order.status !== 'cancelled' && (
                                                <Link href={`/payment/${order._id}`}>
                                                    <Button size="sm" className={`rounded-lg h-9 shadow-sm ${order.paymentStatus === 'pending_verification'
                                                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                                        }`}>
                                                        {order.paymentStatus === 'pending_verification' ? 'Cek Status' : 'Bayar Sekarang'}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 pt-20">
            <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <OrdersList />
            </Suspense>
        </div>
    );
}

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Truck, Clock, XCircle, ShoppingBag, Filter, CreditCard, Box } from 'lucide-react';
import Link from 'next/link';

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

const paymentFilters = [
    { value: 'all', label: 'Semua', icon: CreditCard },
    { value: 'unpaid', label: 'Belum Bayar', color: 'text-gray-600' },
    { value: 'pending_verification', label: 'Verifikasi', color: 'text-orange-600' },
    { value: 'paid', label: 'Lunas', color: 'text-green-600' },
    { value: 'rejected', label: 'Ditolak', color: 'text-red-600' },
];

const shippingFilters = [
    { value: 'all', label: 'Semua', icon: Box },
    { value: 'pending', label: 'Menunggu', color: 'text-yellow-600' },
    { value: 'processing', label: 'Diproses', color: 'text-blue-600' },
    { value: 'shipped', label: 'Dikirim', color: 'text-purple-600' },
    { value: 'delivered', label: 'Selesai', color: 'text-green-600' },
    { value: 'cancelled', label: 'Batal', color: 'text-red-600' },
];

function OrdersList() {
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [shippingFilter, setShippingFilter] = useState('all');
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

    // Filter orders based on selected filters
    const filteredOrders = orders.filter(order => {
        const paymentMatch = paymentFilter === 'all' || order.paymentStatus === paymentFilter || (paymentFilter === 'unpaid' && !order.paymentStatus);
        const shippingMatch = shippingFilter === 'all' || order.status === shippingFilter;
        return paymentMatch && shippingMatch;
    });

    // Count orders for each filter
    const getPaymentCount = (status: string) => {
        if (status === 'all') return orders.length;
        if (status === 'unpaid') return orders.filter(o => !o.paymentStatus || o.paymentStatus === 'unpaid').length;
        return orders.filter(o => o.paymentStatus === status).length;
    };

    const getShippingCount = (status: string) => {
        if (status === 'all') return orders.length;
        return orders.filter(o => o.status === status).length;
    };

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
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                <p className="text-gray-500 mt-1">{orders.length} pesanan total</p>
            </div>

            {/* Success message */}
            {successOrder && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-medium text-green-800">Pesanan berhasil dibuat!</p>
                        <p className="text-sm text-green-600">Nomor pesanan: {successOrder}</p>
                    </div>
                </div>
            )}

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Filter Pesanan</span>
                </div>

                {/* Payment Status Filter */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Status Pembayaran
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {paymentFilters.map((filter) => {
                            const count = getPaymentCount(filter.value);
                            const isActive = paymentFilter === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setPaymentFilter(filter.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Shipping Status Filter */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Status Pengiriman
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {shippingFilters.map((filter) => {
                            const count = getShippingCount(filter.value);
                            const isActive = shippingFilter === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setShippingFilter(filter.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(paymentFilter !== 'all' || shippingFilter !== 'all') && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan <span className="font-semibold text-gray-900">{filteredOrders.length}</span> pesanan
                        </p>
                        <button
                            onClick={() => { setPaymentFilter('all'); setShippingFilter('all'); }}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    {orders.length === 0 ? (
                        <>
                            <p className="text-gray-600 text-lg mb-2">Belum ada pesanan</p>
                            <p className="text-gray-400 mb-6">Yuk mulai belanja!</p>
                            <Link href="/">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 text-lg mb-2">Tidak ada pesanan yang cocok</p>
                            <p className="text-gray-400 mb-4">Coba ubah filter pencarian</p>
                            <button
                                onClick={() => { setPaymentFilter('all'); setShippingFilter('all'); }}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Reset semua filter
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const statusInfo = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={order._id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 flex flex-wrap items-center justify-between gap-4 border-b">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">No. Pesanan</p>
                                                <p className="font-mono font-semibold text-gray-800">{order.orderNumber}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tanggal</p>
                                                <p className="font-medium text-gray-700">
                                                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {order.paymentStatus === 'paid' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Lunas
                                                </Badge>
                                            ) : order.paymentStatus === 'pending_verification' ? (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Verifikasi
                                                </Badge>
                                            ) : order.paymentStatus === 'rejected' ? (
                                                <Badge className="bg-red-100 text-red-700 gap-1">
                                                    <XCircle className="w-3 h-3" />
                                                    Ditolak
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-500 gap-1">
                                                    <CreditCard className="w-3 h-3" />
                                                    Belum Bayar
                                                </Badge>
                                            )}

                                            <Badge className={`${statusInfo.color} gap-1`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4 space-y-3">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} {item.unit} × Rp {item.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-800">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-sm text-gray-400 pl-[66px]">
                                                +{order.items.length - 2} produk lainnya
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="border-t bg-gray-50/50 p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Pembayaran</p>
                                            <p className="text-xl font-bold text-green-600">
                                                Rp {order.totalAmount.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {(!order.paymentStatus || order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected' || order.paymentStatus === 'pending_verification') && order.status !== 'cancelled' && (
                                            <Link href={`/payment/${order._id}`}>
                                                <Button className={`rounded-xl shadow-lg ${order.paymentStatus === 'pending_verification' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25' : 'bg-green-600 hover:bg-green-700 shadow-green-500/25'}`}>
                                                    {order.paymentStatus === 'pending_verification' ? 'Cek Status' : 'Bayar Sekarang'}
                                                </Button>
                                            </Link>
                                        )}
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
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

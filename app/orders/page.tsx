'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Truck, Clock, XCircle, ShoppingBag } from 'lucide-react';
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

function OrdersList() {
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
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

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Belum ada pesanan</p>
                    <p className="text-gray-400 mb-6">Yuk mulai belanja!</p>
                    <Link href="/">
                        <Button className="bg-green-600 hover:bg-green-700">
                            Mulai Belanja
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const statusInfo = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={order._id} className="border-0 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Nomor Pesanan</p>
                                            <p className="font-mono font-medium">{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal</p>
                                            <p className="font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {order.paymentStatus === 'paid' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                                    Lunas
                                                </Badge>
                                            ) : order.paymentStatus === 'pending_verification' ? (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                                                    Cek Pembayaran
                                                </Badge>
                                            ) : order.paymentStatus === 'rejected' ? (
                                                <Badge variant="destructive">
                                                    Pembayaran Ditolak
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-500">
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
                                            <div key={idx} className="flex items-center gap-3">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} {item.unit} × Rp {item.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-sm text-gray-500">
                                                +{order.items.length - 2} produk lainnya
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="border-t p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="text-lg font-bold text-green-600">
                                                Rp {order.totalAmount.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {(order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected') && order.status !== 'cancelled' && (
                                            <Link href={`/payment/${order._id}`}>
                                                <Button className="bg-green-600 hover:bg-green-700">
                                                    Bayar Sekarang
                                                </Button>
                                            </Link>
                                        )}
                                        {order.paymentStatus === 'pending_verification' && (
                                            <Button variant="outline" disabled className="opacity-75 cursor-not-allowed">
                                                Menunggu Verifikasi
                                            </Button>
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
        <div className="min-h-screen bg-gray-50 pt-20">
            <Navbar />
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

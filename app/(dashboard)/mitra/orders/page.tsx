'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    farmer: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
    };
    createdAt: string;
}

const STATUS_FLOW = ['processing', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai'
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700'
};

export default function MitraOrders() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/farmer/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, nextStatus: string) => {
        setUpdating(orderId);
        try {
            const res = await fetch('/api/farmer/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: nextStatus })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setOrders(prev => prev.map(o =>
                    o._id === orderId ? { ...o, status: nextStatus } : o
                ));
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Gagal update status');
        } finally {
            setUpdating(null);
        }
    };

    const getNextStatus = (currentStatus: string): string | null => {
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);
        if (currentIndex < STATUS_FLOW.length - 1) {
            return STATUS_FLOW[currentIndex + 1];
        }
        return null;
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Pesanan</h1>
                <p className="text-sm text-gray-500">Kelola pesanan dari pembeli</p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="p-8 text-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada pesanan</p>
                        <p className="text-sm text-gray-400 mt-1">Pesanan akan muncul setelah pembayaran dikonfirmasi admin</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const nextStatus = getNextStatus(order.status);

                        return (
                            <Card key={order._id} className="border-0 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Order Header */}
                                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                            {STATUS_LABELS[order.status]}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4 space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="px-4 pb-3">
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm">
                                            <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                            </p>
                                            <p className="text-gray-500 text-xs">{order.shippingAddress?.phone}</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-4 border-t bg-white">
                                        {order.status === 'delivered' ? (
                                            <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">Pesanan Selesai</span>
                                            </div>
                                        ) : nextStatus ? (
                                            <Button
                                                onClick={() => updateStatus(order._id, nextStatus)}
                                                disabled={updating === order._id}
                                                className={`w-full rounded-xl h-12 ${nextStatus === 'shipped'
                                                        ? 'bg-purple-600 hover:bg-purple-700'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                    }`}
                                            >
                                                {updating === order._id ? (
                                                    'Memproses...'
                                                ) : nextStatus === 'shipped' ? (
                                                    <>
                                                        <Truck className="w-4 h-4 mr-2" />
                                                        Tandai Dikirim
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Tandai Selesai
                                                    </>
                                                )}
                                            </Button>
                                        ) : null}
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

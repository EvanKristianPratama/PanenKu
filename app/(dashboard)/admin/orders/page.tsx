'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, CheckCircle, Truck, Clock, XCircle, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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
    userEmail: string;
    userName: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentProof?: string;
    createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package },
    shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedProof, setExpandedProof] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            toast.error('Gagal memuat pesanan');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status }),
            });

            if (res.ok) {
                toast.success('Status pesanan berhasil diperbarui');
                fetchOrders();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast.error('Gagal memperbarui status');
        }
    };

    const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus }),
            });

            if (res.ok) {
                toast.success('Status pembayaran berhasil diperbarui');
                fetchOrders();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast.error('Gagal memperbarui pembayaran');
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
                <p className="text-gray-500">Kelola dan update status pesanan pelanggan</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-0 shadow-sm cursor-pointer" onClick={() => setFilter('all')}>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </CardContent>
                </Card>
                <Card className={`border-0 shadow-sm cursor-pointer ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`} onClick={() => setFilter('pending')}>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">Menunggu</p>
                    </CardContent>
                </Card>
                <Card className={`border-0 shadow-sm cursor-pointer ${filter === 'processing' ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setFilter('processing')}>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                        <p className="text-sm text-gray-500">Diproses</p>
                    </CardContent>
                </Card>
                <Card className={`border-0 shadow-sm cursor-pointer ${filter === 'shipped' ? 'ring-2 ring-purple-500' : ''}`} onClick={() => setFilter('shipped')}>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
                        <p className="text-sm text-gray-500">Dikirim</p>
                    </CardContent>
                </Card>
                <Card className={`border-0 shadow-sm cursor-pointer ${filter === 'delivered' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setFilter('delivered')}>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        <p className="text-sm text-gray-500">Selesai</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada pesanan</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const statusInfo = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={order._id} className="border-0 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Header */}
                                    <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-mono font-medium">{order.orderNumber}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <User className="w-3 h-3" />
                                                    {order.userName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {order.paymentStatus === 'paid' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                                    Lunas
                                                </Badge>
                                            ) : order.paymentStatus === 'pending_verification' ? (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                                                    Cek Pembayaran
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

                                    {/* Items */}
                                    <div className="p-4 grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{item.productName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Payment Verification Section */}
                                            {order.paymentStatus === 'pending_verification' && order.paymentProof && (
                                                <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                                    <p className="font-semibold text-orange-800 mb-2">Verifikasi Pembayaran</p>
                                                    <div className="flex gap-4 items-start">
                                                        <div className="relative group">
                                                            <img
                                                                src={order.paymentProof}
                                                                alt="Bukti Bayar"
                                                                className="w-24 h-24 object-cover rounded-lg cursor-pointer border-2 border-orange-200 hover:border-orange-400"
                                                                onClick={() => setExpandedProof(expandedProof === order._id ? null : order._id)}
                                                            />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xs cursor-pointer" onClick={() => setExpandedProof(expandedProof === order._id ? null : order._id)}>
                                                                {expandedProof === order._id ? 'Tutup' : 'Lihat'}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Button
                                                                size="sm"
                                                                className="w-full bg-green-600 hover:bg-green-700"
                                                                onClick={() => updatePaymentStatus(order._id, 'paid')}
                                                            >
                                                                Terima
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                onClick={() => updatePaymentStatus(order._id, 'rejected')}
                                                            >
                                                                Tolak
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {expandedProof === order._id && (
                                                        <div className="mt-4">
                                                            <img
                                                                src={order.paymentProof}
                                                                alt="Bukti Bayar Full"
                                                                className="w-full rounded-lg shadow-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-between items-end">
                                            <div className="text-right mb-4">
                                                <p className="text-sm text-gray-500">Total Pesanan</p>
                                                <p className="text-xl font-bold text-green-600">
                                                    Rp {order.totalAmount.toLocaleString('id-ID')}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(order.createdAt).toLocaleString('id-ID')}
                                                </p>
                                            </div>

                                            <div className="w-full md:w-auto">
                                                <p className="text-xs text-gray-500 mb-1.5 font-medium">Update Status Pesanan</p>
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => updateStatus(order._id, value)}
                                                >
                                                    <SelectTrigger className="w-full md:w-48">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Menunggu</SelectItem>
                                                        <SelectItem value="processing">Diproses</SelectItem>
                                                        <SelectItem value="shipped">Dikirim</SelectItem>
                                                        <SelectItem value="delivered">Selesai</SelectItem>
                                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
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

'use client';

import { useSession, signOut } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut, ShoppingBag, Heart, Settings, MapPin, Star, Truck, CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [orderStats, setOrderStats] = useState({
        total: 0,
        shipped: 0,
        delivered: 0
    });

    useEffect(() => {
        if (session?.user) {
            fetch('/api/orders')
                .then(res => res.json())
                .then(data => {
                    const fetchedOrders = data.orders || [];
                    setOrders(fetchedOrders);
                    setOrderStats({
                        total: fetchedOrders.length,
                        shipped: fetchedOrders.filter((o: any) => o.status === 'shipped').length,
                        delivered: fetchedOrders.filter((o: any) => o.status === 'delivered').length
                    });
                })
                .catch(err => console.error('Failed to fetch orders:', err));
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    const handleLogout = () => {
        signOut({ callbackUrl: window.location.origin + '/login' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                        {/* Banner Background */}
                        <div className="h-48 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                            </div>
                        </div>

                        <div className="relative px-8 pb-8">
                            <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center text-4xl font-bold text-green-700">
                                            {session.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{session.user?.name}</h1>
                                    <div className="flex items-center gap-4 mt-1 text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-4 h-4" />
                                            <span>{session.user?.email}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="w-4 h-4 text-green-600" />
                                            <span className="capitalize font-medium text-green-700">{(session.user as any)?.role || 'Member'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mb-2">
                                    <Link href="/orders">
                                        <Button className="bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200">
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Pesanan
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="border-gray-200 rounded-xl hover:bg-gray-50">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Pengaturan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Quick Stats */}
                        <div className="md:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Statistik Belanja</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Card className="border-0 shadow-sm bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{orderStats.total}</p>
                                        <p className="text-sm text-gray-500">Total Pesanan</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                                            <Truck className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{orderStats.shipped}</p>
                                        <p className="text-sm text-gray-500">Dikirim</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-green-50/50 hover:bg-green-50 transition-colors col-span-2 md:col-span-1">
                                    <CardContent className="p-6">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{orderStats.delivered}</p>
                                        <p className="text-sm text-gray-500">Selesai</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900">Aktivitas Terakhir</h3>
                                    <Link href="/orders">
                                        <Button variant="link" className="text-green-600">Lihat Semua</Button>
                                    </Link>
                                </div>
                                {orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.slice(0, 3).map((order: any) => (
                                            <div key={order._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <ShoppingBag className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status === 'pending' ? 'Menunggu' :
                                                                order.status === 'processing' ? 'Diproses' :
                                                                    order.status === 'shipped' ? 'Dikirim' :
                                                                        order.status === 'delivered' ? 'Selesai' : order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <p>{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                        <p className="font-medium text-green-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500">Belum ada aktivitas belanja</p>
                                        <Link href="/">
                                            <Button variant="link" className="text-green-600 font-medium mt-1">
                                                Mulai Belanja Sekarang
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Detail Akun</h2>
                            <Card className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer border-b border-gray-100">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Edit Profil</p>
                                            <p className="text-xs text-gray-500">Ubah biodata diri</p>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer border-b border-gray-100">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Alamat Pengiriman</p>
                                            <p className="text-xs text-gray-500">Atur alamat rumah</p>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer border-b border-gray-100">
                                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Keamanan</p>
                                            <p className="text-xs text-gray-500">Password & verifikasi</p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Keluar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

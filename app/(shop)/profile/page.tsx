'use client';

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Shield, LogOut, ShoppingBag, Settings, MapPin, Truck, CheckCircle, RefreshCw, Pause, Play, Trash2, Phone, Edit3, Save, X } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Subscription {
    _id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    unit: string;
    frequency: string;
    nextDelivery: string;
    status: string;
}

interface UserProfile {
    name: string;
    phone: string;
    address: string;
    city: string;
}

const FREQUENCY_LABELS: Record<string, string> = {
    daily: 'Harian',
    weekly: 'Mingguan',
    biweekly: '2 Mingguan',
    monthly: 'Bulanan'
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu Bayar', color: 'bg-amber-100 text-amber-700' },
    active: { label: 'Aktif', color: 'bg-green-100 text-green-700' },
    paused: { label: 'Dijeda', color: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [orderStats, setOrderStats] = useState({ total: 0, shipped: 0, delivered: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({ name: '', phone: '', address: '', city: '' });
    const [editForm, setEditForm] = useState<UserProfile>({ name: '', phone: '', address: '', city: '' });

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
                });

            fetch('/api/subscriptions')
                .then(res => res.json())
                .then(data => setSubscriptions(data.subscriptions || []));

            fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        const p = { name: data.user.name, phone: data.user.phone || '', address: data.user.address || '', city: data.user.city || '' };
                        setProfile(p);
                        setEditForm(p);
                    }
                });
        }
    }, [session]);

    const toggleSubscription = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: id, status: newStatus })
            });
            if (res.ok) {
                toast.success(newStatus === 'paused' ? 'Langganan dijeda' : 'Langganan aktif');
                setSubscriptions(prev => prev.map(s => s._id === id ? { ...s, status: newStatus } : s));
            }
        } catch { toast.error('Gagal memperbarui langganan'); }
    };

    const cancelSubscription = async (id: string) => {
        if (!confirm('Yakin ingin membatalkan langganan ini?')) return;
        try {
            const res = await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Langganan dibatalkan');
                setSubscriptions(prev => prev.filter(s => s._id !== id));
            }
        } catch { toast.error('Gagal membatalkan langganan'); }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                toast.success('Profil berhasil diperbarui');
                setProfile(editForm);
                setIsEditing(false);
            }
        } catch { toast.error('Gagal menyimpan profil'); }
        finally { setIsSaving(false); }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) redirect("/login");

    const handleLogout = () => signOut({ callbackUrl: window.location.origin + '/login' });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-24 pb-12 container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header Card - Original Style */}
                    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                        <div className="h-48 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                            </div>
                        </div>

                        <div className="relative px-8 pb-8">
                            <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
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
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Stats */}
                            <h2 className="text-xl font-bold text-gray-900">Statistik Belanja</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="border-0 shadow-sm bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                                        <p className="text-xs text-gray-500">Total Pesanan</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                                            <Truck className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
                                        <p className="text-xs text-gray-500">Dikirim</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-green-50/50 hover:bg-green-50 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                                        <p className="text-xs text-gray-500">Selesai</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-orange-50/50 hover:bg-orange-50 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                            <RefreshCw className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{subscriptions.filter(s => s.status === 'active').length}</p>
                                        <p className="text-xs text-gray-500">Langganan</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Subscriptions */}
                            {subscriptions.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <RefreshCw className="w-5 h-5 text-purple-600" />
                                            Langganan Saya
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {subscriptions.map(sub => {
                                            const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                                            return (
                                                <div key={sub._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <img src={sub.productImage} alt={sub.productName} className="w-14 h-14 rounded-lg object-cover" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900 truncate">{sub.productName}</p>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>{sub.quantity} {sub.unit}</span>
                                                            <span>•</span>
                                                            <span>{FREQUENCY_LABELS[sub.frequency]}</span>
                                                            <span>•</span>
                                                            <span className="text-green-600 font-medium">Rp {(sub.price * sub.quantity).toLocaleString()}</span>
                                                        </div>
                                                        {sub.status === 'active' && (
                                                            <p className="text-xs text-gray-400 mt-1">Berikutnya: {new Date(sub.nextDelivery).toLocaleDateString('id-ID')}</p>
                                                        )}
                                                    </div>
                                                    {sub.status !== 'pending' && sub.status !== 'cancelled' && (
                                                        <div className="flex items-center gap-2">
                                                            <Button size="icon" variant="outline" className={`h-8 w-8 ${sub.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`} onClick={() => toggleSubscription(sub._id, sub.status)}>
                                                                {sub.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => cancelSubscription(sub._id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Recent Orders */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900">Aktivitas Terakhir</h3>
                                    <Link href="/orders"><Button variant="link" className="text-green-600">Lihat Semua</Button></Link>
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
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.status === 'pending' ? 'Menunggu' : order.status === 'processing' ? 'Diproses' : order.status === 'shipped' ? 'Dikirim' : order.status === 'delivered' ? 'Selesai' : order.status}
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
                                        <Link href="/"><Button variant="link" className="text-green-600 font-medium mt-1">Mulai Belanja Sekarang</Button></Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Detail Akun</h2>
                            <Card className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Editable Profile Fields */}
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-800">Informasi Pribadi</h4>
                                            {!isEditing ? (
                                                <button onClick={() => setIsEditing(true)} className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                            ) : (
                                                <button onClick={() => { setEditForm(profile); setIsEditing(false); }} className="text-sm text-gray-500 hover:text-gray-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Nama</p>
                                                {isEditing ? (
                                                    <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="mt-1 h-8 text-sm" />
                                                ) : (
                                                    <p className="font-medium text-gray-800">{profile.name || '-'}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">No. HP</p>
                                                {isEditing ? (
                                                    <Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="08xx-xxxx-xxxx" className="mt-1 h-8 text-sm" />
                                                ) : (
                                                    <p className="font-medium text-gray-800">{profile.phone || <span className="text-gray-400 text-sm">Belum diisi</span>}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Alamat</p>
                                                {isEditing ? (
                                                    <Input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} placeholder="Jl. Contoh No. 123" className="mt-1 h-8 text-sm" />
                                                ) : (
                                                    <p className="font-medium text-gray-800">{profile.address || <span className="text-gray-400 text-sm">Belum diisi</span>}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Kota</p>
                                                {isEditing ? (
                                                    <Input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} placeholder="Jakarta" className="mt-1 h-8 text-sm" />
                                                ) : (
                                                    <p className="font-medium text-gray-800">{profile.city || <span className="text-gray-400 text-sm">Belum diisi</span>}</p>
                                                )}
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-green-600 hover:bg-green-700 rounded-xl">
                                                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Simpan</>}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Logout */}
                                    <div className="p-4 border-t">
                                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3" onClick={handleLogout}>
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

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, CreditCard, Copy, CheckCircle, ArrowLeft, Wallet, Globe } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function PaymentPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [snapToken, setSnapToken] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchOrder();
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders?id=${params.id}`);
            const data = await res.json();
            const userOrder = data.orders?.find((o: any) => o._id === params.id);
            if (userOrder) {
                setOrder(userOrder);
            } else {
                toast.error('Pesanan tidak ditemukan');
                router.push('/orders');
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
            toast.error('Gagal memuat data pesanan');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleMidtransPayment = async () => {
        try {
            setUploading(true);

            // Generate token
            const res = await fetch('/api/midtrans/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.orderNumber,
                    grossAmount: order.totalAmount
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to get token');

            setSnapToken(data.token);

            // @ts-ignore
            if (window.snap) {
                // @ts-ignore
                window.snap.pay(data.token, {
                    onSuccess: function (result: any) {
                        toast.success('Pembayaran Berhasil! Memverifikasi...');
                        // Optionally call notification endpoint or just refresh
                        setTimeout(() => fetchOrder(), 2000);
                    },
                    onPending: function (result: any) {
                        toast.info('Menunggu pembayaran...');
                        fetchOrder();
                    },
                    onError: function (result: any) {
                        toast.error('Pembayaran gagal!');
                    },
                    onClose: function () {
                        toast.warning('Pembayaran belum diselesaikan');
                    }
                });
            } else {
                toast.error('Sistem pembayaran belum siap. Silakan refresh halaman.');
            }

        } catch (error) {
            console.error('Midtrans Error:', error);
            toast.error('Gagal memuat pembayaran otomatis');
        } finally {
            setUploading(false);
        }
    };

    const handlePayment = async (method: 'manual' | 'dana' = 'manual') => {
        if (method === 'manual' && (!file || !preview)) {
            toast.error('Silakan pilih bukti pembayaran terlebih dahulu');
            return;
        }

        setUploading(true);
        try {
            const body = method === 'dana'
                ? { paymentMethod: 'dana' }
                : { paymentProof: preview, paymentMethod: 'manual' };

            const res = await fetch(`/api/orders/${params.id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Payment failed');

            const data = await res.json();
            toast.success(data.message || 'Pembayaran berhasil!');
            fetchOrder();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Gagal memproses pembayaran');
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Disalin ke clipboard');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key="SB-Mid-client-owXNSzDK0hPZ8vRZ"
                strategy="lazyOnload"
            />
            <div className="pt-24 container mx-auto px-4 max-w-2xl">
                <Link href="/orders">
                    <Button variant="ghost" className="mb-4 pl-0 text-gray-500 hover:text-green-600">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Pesanan
                    </Button>
                </Link>

                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold">Pembayaran</CardTitle>
                                <p className="text-green-100 opacity-90 mt-1">Selesaikan pesanan #{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-90">Total Tagihan</p>
                                <p className="text-2xl font-bold">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* Status Alert: Pending Verification */}
                        {order.paymentStatus === 'pending_verification' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-medium text-yellow-800">
                                        {order.snap_token ? 'Menunggu Pembayaran' : 'Menunggu Verifikasi'}
                                    </p>
                                    <p className="text-sm text-yellow-600">
                                        {order.snap_token
                                            ? 'Silakan selesaikan pembayaran Anda.'
                                            : 'Bukti pembayaran Anda sedang dicek oleh admin.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status Alert: Paid */}
                        {order.paymentStatus === 'paid' && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">Pembayaran Berhasil</p>
                                    <p className="text-sm text-green-600">Pesanan Anda akan segera diproses.</p>
                                </div>
                            </div>
                        )}

                        {/* Payment Options (Show if Unpaid, Rejected, OR Pending Midtrans) */}
                        {(!order.paymentStatus || order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected' || (order.paymentStatus === 'pending_verification' && order.snap_token)) && (
                            <div className="space-y-6">
                                {/* Midtrans Payment */}
                                <div className="text-center">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">

                                        {/* Deadline Info */}
                                        <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                            <p className="text-sm text-orange-600 mb-1">Batas Waktu Pembayaran</p>
                                            <p className="text-lg font-bold text-orange-800">
                                                {new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-green-200"
                                            onClick={handleMidtransPayment}
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Memuat...' : (order.snap_token ? 'Lanjutkan Pembayaran' : 'Bayar Sekarang')}
                                        </Button>

                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                            <span>Secure Payment by</span>
                                            <img
                                                src="/midtrans-logo.png"
                                                alt="Midtrans"
                                                className="h-4 object-contain opacity-60 grayscale hover:grayscale-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

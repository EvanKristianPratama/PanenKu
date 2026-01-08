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
                                    <p className="font-medium text-yellow-800">Menunggu Verifikasi</p>
                                    <p className="text-sm text-yellow-600">Bukti pembayaran Anda sedang dicek oleh admin.</p>
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

                        {/* Payment Options (Show only if Unpaid/Rejected) */}
                        {(!order.paymentStatus || order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected') && (
                            <>
                                {/* Midtrans Payment */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-indigo-600" />
                                        Pembayaran Otomatis
                                    </h3>
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_midtrans.png/1200px-Logo_midtrans.png"
                                                    alt="Midtrans"
                                                    className="h-6 object-contain"
                                                />
                                                <div>
                                                    <p className="font-semibold text-indigo-900">Virtual Account & QRIS</p>
                                                    <p className="text-xs text-indigo-600">BCA, Mandiri, BRI, QRIS</p>
                                                </div>
                                            </div>
                                            <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                                                Recomended
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                            onClick={handleMidtransPayment}
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Memuat...' : 'Bayar via Midtrans'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Bank Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                        Metode Transfer Bank
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-700">
                                                    BCA
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Bank Central Asia</p>
                                                    <p className="font-mono font-medium text-lg">123 456 7890</p>
                                                    <p className="text-xs text-gray-400">a.n. PT PanenKu Sejahtera</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard('1234567890')}>
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </div>
                                        <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center font-bold text-yellow-700">
                                                    MN
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Bank Mandiri</p>
                                                    <p className="font-mono font-medium text-lg">098 765 4321</p>
                                                    <p className="text-xs text-gray-400">a.n. PT PanenKu Sejahtera</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard('0987654321')}>
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>



                                {/* Upload Proof */}
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-green-600" />
                                        Upload Bukti Pembayaran
                                    </h3>

                                    {order.paymentStatus === 'rejected' && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
                                            Pembayaran sebelumnya ditolak. Silakan upload bukti pembayaran yang valid.
                                        </div>
                                    )}

                                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-green-500 transition-colors">
                                        {preview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                                                />
                                                <Button variant="outline" onClick={() => {
                                                    setFile(null);
                                                    setPreview(null);
                                                }}>
                                                    Ganti Foto
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <Button variant="outline" className="relative">
                                                        Pilih Gambar
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                        />
                                                    </Button>
                                                    <p className="text-sm text-gray-400 mt-2">JPG, PNG maks 2MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full mt-6 bg-green-600 hover:bg-green-700 py-6 text-lg"
                                        disabled={!file || uploading}
                                        onClick={() => handlePayment('manual')}
                                    >
                                        {uploading ? 'Mengupload...' : 'Konfirmasi Pembayaran'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

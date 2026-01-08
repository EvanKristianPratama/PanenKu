
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
import { Upload, CreditCard, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

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
            // The API returns { orders: [...] } usually, but for single ID fetch we might need to adjust or filter
            // Assuming the current /api/orders might return a list even for one.
            // Let's assume we need to filter or the API handles it.
            // Actually, /api/orders returns all orders for user.
            // Optimization: Filter client side for now as the API might not support ID filter yet.
            const userOrder = data.orders.find((o: any) => o._id === params.id);
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
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file || !preview) {
            toast.error('Silakan pilih bukti pembayaran terlebih dahulu');
            return;
        }

        setUploading(true);
        try {
            const res = await fetch(`/api/orders/${params.id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentProof: preview,
                }),
            });

            if (!res.ok) throw new Error('Upload failed');

            toast.success('Bukti pembayaran berhasil diupload!');
            fetchOrder(); // Refresh status
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Gagal mengupload bukti pembayaran');
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
                        {/* Status Alert */}
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

                        {order.paymentStatus === 'paid' && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">Pembayaran Berhasil</p>
                                    <p className="text-sm text-green-600">Pesanan Anda akan segera diproses.</p>
                                </div>
                            </div>
                        )}

                        {(order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected') && (
                            <>
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
                                <div>
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
                                        onClick={handleUpload}
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

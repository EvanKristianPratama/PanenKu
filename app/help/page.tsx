'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sprout, Truck, RefreshCw, HelpCircle, CheckCircle, ChevronRight } from 'lucide-react';

function HelpContent() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'shopping';
    const [tab, setTab] = useState(activeTab);

    // Sync tab with URL param on load
    useEffect(() => {
        if (activeTab) {
            setTab(activeTab);
        }
    }, [activeTab]);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-4">Pusat Bantuan</h1>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                Temukan jawaban untuk pertanyaan Anda seputar belanja, pengiriman, dan layanan pelanggan PanenKu.
            </p>

            <Tabs value={tab} onValueChange={setTab} className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl">
                    <TabsTrigger value="shopping" className="py-3 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all">
                        <Sprout className="w-4 h-4 mr-2" />
                        Cara Belanja
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="py-3 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all">
                        <Truck className="w-4 h-4 mr-2" />
                        Pengiriman
                    </TabsTrigger>
                    <TabsTrigger value="returns" className="py-3 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Pengembalian
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="py-3 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        FAQ
                    </TabsTrigger>
                </TabsList>

                {/* Cara Belanja */}
                <TabsContent value="shopping" className="animate-in fade-in-50 duration-300">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Cara Belanja di PanenKu</CardTitle>
                            <CardDescription>Panduan mudah berbelanja produk segar</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { title: "Daftar atau Masuk", desc: "Buat akun baru atau masuk jika sudah punya." },
                                { title: "Pilih Produk Segar", desc: "Jelajahi katalog dan masukkan produk ke keranjang." },
                                { title: "Isi Alamat Pengiriman", desc: "Pastikan alamat lengkap agar pengiriman lancar." },
                                { title: "Checkout & Bayar", desc: "Selesaikan pesanan dan tunggu konfirmasi." }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pengiriman */}
                <TabsContent value="shipping" className="animate-in fade-in-50 duration-300">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Informasi Pengiriman</CardTitle>
                            <CardDescription>Bagaimana pesanan Anda sampai ke rumah</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start mb-6">
                                <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">Dikirim Langsung oleh Petani</h3>
                                    <p className="text-blue-700 text-sm leading-relaxed">
                                        Untuk menjamin kesegaran terbaik, semua produk dikirim langsung dari lokasi panen petani mitra kami. Kami bekerja sama dengan kurir lokal terpercaya untuk memastikan sayur dan buah tiba dalam kondisi prima.
                                    </p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Waktu Pengiriman</h4>
                                    <p className="text-sm text-gray-500">Estimasi 1-2 hari setelah panen untuk menjaga kualitas.</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Area Layanan</h4>
                                    <p className="text-sm text-gray-500">Saat ini melayani area Bandung dan sekitarnya.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pengembalian */}
                <TabsContent value="returns" className="animate-in fade-in-50 duration-300">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Kebijakan Pengembalian</CardTitle>
                            <CardDescription>Jaminan kepuasan pelanggan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Kami berkomitmen memberikan produk terbaik. Jika Anda menerima produk yang:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2">
                                    <li>Rusak atau busuk saat diterima</li>
                                    <li>Tidak sesuai dengan pesanan</li>
                                    <li>Berat kurang dari toleransi wajar</li>
                                </ul>
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mt-4">
                                    <p className="text-amber-800 text-sm font-medium">
                                        ⚠️ Silakan hubungi petani terkait melalui kontak yang tertera pada detail pesanan Anda, atau hubungi Customer Service kami dalam 24 jam setelah barang diterima.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FAQ */}
                <TabsContent value="faq" className="animate-in fade-in-50 duration-300">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Pertanyaan Sering Diajukan (FAQ)</CardTitle>
                            <CardDescription>Jawaban cepat untuk pertanyaan umum</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {[
                                    { q: "Apakah semua produk organik?", a: "Kami memiliki berbagai kategori produk, termasuk organik dan konvensional. Produk organik akan memiliki label khusus 'Organik' pada foto produknya." },
                                    { q: "Metode pembayaran apa saja yang tersedia?", a: "Saat ini kami menerima pembayaran melalui transfer bank (BCA, Mandiri) dan e-wallet (GoPay, OVO)." },
                                    { q: "Bagaimana jika stok habis setelah pesan?", a: "Kami berusaha update stok realtime. Namun jika terjadi selisih, dana Anda akan kami refund 100% atau ditawarkan produk pengganti." },
                                    { q: "Apakah ada minimum pesanan?", a: "Tidak ada minimum pesanan! Anda bisa beli sesuai kebutuhan rumah tangga." }
                                ].map((faq, idx) => (
                                    <AccordionItem key={idx} value={`item-${idx}`}>
                                        <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-green-600">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-500">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <HelpContent />
            </Suspense>
        </div>
    );
}

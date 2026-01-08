'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image, ExternalLink } from "lucide-react";
import Link from "next/link";
import { addProduct } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        try {
            await addProduct(formData);
            toast.success("Produk berhasil ditambahkan");
        } catch (error) {
            toast.error("Gagal menambahkan produk");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Tambah Produk Baru</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input id="name" name="name" placeholder="Contoh: Beras Organik" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input id="price" name="price" type="number" min="0" placeholder="0" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Satuan</Label>
                            <Input id="unit" name="unit" placeholder="kg, ikat, dll" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input id="category" name="category" placeholder="Sayuran, Buah, dll" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stok Awal</Label>
                            <Input id="stock" name="stock" type="number" min="0" placeholder="0" required />
                        </div>
                    </div>

                    {/* Image URL Field */}
                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            URL Gambar Produk
                        </Label>
                        <Input
                            id="image"
                            name="image"
                            type="url"
                            placeholder="https://images.unsplash.com/photo-xxx"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            Gunakan link gambar dari
                            <a
                                href="https://unsplash.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline inline-flex items-center gap-1"
                            >
                                Unsplash <ExternalLink className="w-3 h-3" />
                            </a>
                        </p>
                        {imageUrl && (
                            <div className="mt-2 relative rounded-lg overflow-hidden border">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    Preview
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea id="description" name="description" placeholder="Deskripsi lengkap produk..." required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="farmer">Nama Petani</Label>
                            <Input id="farmer" name="farmer" placeholder="Nama Petani" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Lokasi</Label>
                            <Input id="location" name="location" placeholder="Lokasi Kebun" required />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link href="/admin/products">
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Menyimpan...' : 'Simpan Produk'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

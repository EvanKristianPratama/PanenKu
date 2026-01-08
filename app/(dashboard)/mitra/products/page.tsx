'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Package, Minus, X, Image, ExternalLink, Save } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Sayuran', 'Buah', 'Beras', 'Bumbu', 'Lainnya'];

interface Product {
    _id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    stock: number;
    description: string;
    location: string;
}

export default function MitraProducts() {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '',
        price: '',
        unit: 'kg',
        category: 'Sayuran',
        stock: '',
        location: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProducts();
        }
    }, [status]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/farmer/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/farmer/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setShowModal(false);
                setForm({ name: '', price: '', unit: 'kg', category: 'Sayuran', stock: '', location: '', description: '', image: '' });
                fetchProducts();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Gagal menambah produk');
        } finally {
            setSubmitting(false);
        }
    };

    const updateStock = async (productId: string, newStock: number) => {
        if (newStock < 0) return;

        try {
            const res = await fetch('/api/farmer/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, stock: newStock })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p =>
                    p._id === productId ? { ...p, stock: newStock } : p
                ));
                toast.success('Stok diupdate');
            }
        } catch (error) {
            toast.error('Gagal update stok');
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Produk Saya</h1>
                    <p className="text-sm text-gray-500">{products.length} produk terdaftar</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                </Button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">Belum ada produk</p>
                        <Button onClick={() => setShowModal(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Produk Pertama
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <Card key={product._id} className="border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                                <p className="text-sm text-gray-500">{product.category}</p>
                                            </div>
                                            <span className="text-green-600 font-bold whitespace-nowrap">
                                                Rp {product.price.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Stock Stepper */}
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-sm text-gray-500">Stok:</span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => updateStock(product._id, product.stock - 1)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="w-12 text-center font-bold">{product.stock}</span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => updateStock(product._id, product.stock + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <span className="text-sm text-gray-400">{product.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Product Modal - Admin Style */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Produk Baru</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Nama Produk */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Contoh: Beras Organik"
                                    required
                                />
                            </div>

                            {/* Harga & Satuan */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga (Rp)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Satuan</Label>
                                    <Input
                                        id="unit"
                                        value={form.unit}
                                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                        placeholder="kg, ikat, dll"
                                    />
                                </div>
                            </div>

                            {/* Kategori & Stok */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <select
                                        id="category"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok Awal</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Image URL - Like Admin */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    URL Gambar Produk
                                </Label>
                                <Input
                                    id="image"
                                    type="url"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/photo-xxx"
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
                                {form.image && (
                                    <div className="mt-2 relative rounded-lg overflow-hidden border">
                                        <img
                                            src={form.image}
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

                            {/* Lokasi */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    placeholder="Lokasi Kebun"
                                />
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Deskripsi lengkap produk..."
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={submitting}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


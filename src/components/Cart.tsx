'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Trash2, Plus, Minus, ShoppingBag, LogIn, CheckCircle, MapPin, FileText } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from "@/context/CartContext";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';

export function Cart() {
  const { cartItems: items, updateQuantity: onUpdateQuantity, removeFromCart: onRemoveItem, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Silakan login untuk melanjutkan checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Alamat pengiriman harus diisi');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Prepare cart items for API
      const cartItemsForApi = items.map(item => ({
        productId: String(item.product.id),
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItemsForApi,
          shippingAddress: shippingAddress.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        setShippingAddress('');
        setNotes('');
        toast.success('Pesanan berhasil dibuat!');
        router.push(`/orders?success=${data.order.orderNumber}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Checkout gagal');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-8">Yuk mulai belanja produk segar!</p>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 px-8">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b pt-12">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
          <p className="text-gray-500">{items.length} produk</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.product.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-green-600 font-medium">
                        Rp {item.product.price.toLocaleString('id-ID')} / {item.product.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(String(item.product.id), Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(String(item.product.id), Math.min(item.product.stock, item.quantity + 1))}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                        onClick={() => onRemoveItem(String(item.product.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Shipping Info Card */}
            {session && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Informasi Pengiriman
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shippingAddress" className="text-gray-700 font-medium">
                        Alamat Pengiriman <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="shippingAddress"
                        placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos)"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="mt-2 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-gray-700 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Catatan (Opsional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Tambahkan catatan untuk penjual (contoh: waktu pengiriman, instruksi khusus)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} produk)</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-green-600 font-medium">GRATIS</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {session ? (
                  <>
                    {!shippingAddress.trim() && (
                      <p className="text-sm text-amber-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Isi alamat pengiriman untuk checkout
                      </p>
                    )}
                    <Button
                      className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !shippingAddress.trim()}
                    >
                      {isCheckingOut ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Checkout
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login untuk Checkout
                    </Button>
                  </Link>
                )}
              </CardContent>
              <CardFooter className="bg-green-50 p-4 rounded-b-lg">
                <p className="text-sm text-green-700">🌱 Produk segar dikirim langsung dari petani</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

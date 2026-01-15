'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Trash2, Plus, Minus, ShoppingBag, LogIn, CheckCircle, MapPin, FileText, RefreshCw, Clock, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from "@/context/CartContext";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Mingguan', desc: '7 hari', color: 'from-emerald-500 to-teal-500' },
  { value: 'biweekly', label: '2 Minggu', desc: '14 hari', color: 'from-teal-500 to-cyan-500' },
  { value: 'monthly', label: 'Bulanan', desc: '30 hari', color: 'from-cyan-500 to-blue-500' },
];

interface SubscriptionItem {
  productId: string;
  frequency: string;
  enabled: boolean;
}

interface SavedAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export function Cart() {
  const { cartItems: items, updateQuantity: onUpdateQuantity, removeFromCart: onRemoveItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Fetch saved address
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user && (data.user.address || data.user.phone)) {
            setSavedAddress({
              name: data.user.name || '',
              phone: data.user.phone || '',
              address: data.user.address || '',
              city: data.user.city || ''
            });
          }
        })
        .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [isAuthenticated]);

  // Initialize subscriptions state when items change
  useEffect(() => {
    setSubscriptions(
      items
        .filter((item) => (item.product as any).isSubscribable)
        .map((item) => ({
          productId: String(item.product.id),
          frequency: 'weekly',
          enabled: false,
        }))
    );
  }, [items.length]);

  // Toggle saved address
  const handleUseSavedAddress = () => {
    if (!useSavedAddress && savedAddress) {
      const fullAddress = [savedAddress.address, savedAddress.city].filter(Boolean).join(', ');
      setShippingAddress(fullAddress);
    }
    setUseSavedAddress(!useSavedAddress);
  };

  const toggleSubscription = (productId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.productId === productId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const setFrequency = (productId: string, frequency: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.productId === productId ? { ...s, frequency } : s
      )
    );
  };

  const getSubscription = (productId: string) => {
    return subscriptions.find((s) => s.productId === productId);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login untuk melanjutkan checkout');
      router.push(ROUTES.LOGIN);
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
        // Create subscriptions for enabled items (status: pending until payment)
        const enabledSubs = subscriptions.filter((s) => s.enabled);
        for (const sub of enabledSubs) {
          const item = items.find((i) => String(i.product.id) === sub.productId);
          if (item) {
            const addressParts = shippingAddress.split(',').map((p) => p.trim());
            await fetch('/api/subscriptions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.product.id,
                quantity: item.quantity,
                frequency: sub.frequency,
                orderId: data.order._id,
                shippingAddress: {
                  name: savedAddress?.name || 'Pelanggan',
                  phone: savedAddress?.phone || '-',
                  address: addressParts[0] || shippingAddress,
                  city: addressParts[1] || savedAddress?.city || 'Indonesia',
                },
              }),
            });
          }
        }

        clearCart();
        setShippingAddress('');
        setNotes('');

        if (enabledSubs.length > 0) {
          toast.success(`Pesanan dibuat! Langganan akan aktif setelah pembayaran.`);
        } else {
          toast.success('Pesanan berhasil dibuat!');
        }
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
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-8">Yuk mulai belanja produk segar!</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 shadow-lg shadow-green-500/20">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white/80 backdrop-blur-sm border-b pt-12 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
          <p className="text-gray-500">{items.length} produk</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const isSubscribable = (item.product as any).isSubscribable;
              const subscription = getSubscription(String(item.product.id));

              return (
                <Card key={item.product.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="relative">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-sm"
                        />
                        {isSubscribable && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <RefreshCw className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-lg">{item.product.name}</h3>
                        <p className="text-emerald-600 font-medium">
                          Rp {item.product.price.toLocaleString('id-ID')} <span className="text-gray-400 text-sm">/ {item.product.unit}</span>
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center bg-gray-100/80 rounded-full p-1">
                            <button
                              className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm transition-all flex items-center justify-center"
                              onClick={() => onUpdateQuantity(String(item.product.id), Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm transition-all flex items-center justify-center"
                              onClick={() => onUpdateQuantity(String(item.product.id), Math.min(item.product.stock, item.quantity + 1))}
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          <span className="text-xs text-gray-400">Stok: {item.product.stock}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end justify-between">
                        <p className="font-bold text-gray-900 text-lg">
                          Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                        <button
                          className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 transition-colors flex items-center justify-center"
                          onClick={() => onRemoveItem(String(item.product.id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subscription Option */}
                    {isSubscribable && subscription && (
                      <div className={`mt-5 p-4 rounded-2xl transition-all ${subscription.enabled ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100' : 'bg-gray-50/50'}`}>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleSubscription(String(item.product.id))}
                            className="flex items-center gap-3 group"
                          >
                            <div className={`w-12 h-7 rounded-full p-1 transition-all ${subscription.enabled ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30' : 'bg-gray-200'}`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${subscription.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <div className="text-left">
                              <span className={`font-medium ${subscription.enabled ? 'text-violet-700' : 'text-gray-500'}`}>
                                Jadikan Langganan
                              </span>
                              {!subscription.enabled && (
                                <p className="text-xs text-gray-400">Aktif setelah pembayaran lunas</p>
                              )}
                            </div>
                          </button>
                        </div>

                        {subscription.enabled && (
                          <div className="mt-4 space-y-3">
                            <p className="text-xs text-gray-500 font-medium">Pilih Frekuensi:</p>
                            <div className="flex gap-2">
                              {FREQUENCY_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setFrequency(String(item.product.id), opt.value)}
                                  className={`flex-1 py-2.5 px-3 rounded-xl text-center transition-all ${subscription.frequency === opt.value
                                      ? `bg-gradient-to-r ${opt.color} text-white shadow-lg`
                                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                    }`}
                                >
                                  <p className="font-semibold text-sm">{opt.label}</p>
                                  <p className={`text-xs ${subscription.frequency === opt.value ? 'text-white/80' : 'text-gray-400'}`}>{opt.desc}</p>
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-violet-600 bg-violet-50 px-3 py-2 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Langganan aktif setelah pembayaran dikonfirmasi</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Shipping Info Card */}
            {isAuthenticated && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    Informasi Pengiriman
                  </h3>

                  {/* Saved Address Toggle */}
                  {savedAddress && savedAddress.address && (
                    <div className="mb-5 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-700">Alamat Tersimpan</span>
                        </div>
                        <button
                          onClick={handleUseSavedAddress}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${useSavedAddress
                              ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                              : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                            }`}
                        >
                          {useSavedAddress ? '✓ Digunakan' : 'Gunakan'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-800">{savedAddress.name}</p>
                        {savedAddress.phone && <p>📱 {savedAddress.phone}</p>}
                        <p>📍 {savedAddress.address}{savedAddress.city && `, ${savedAddress.city}`}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="shippingAddress" className="text-gray-700 font-medium">
                        Alamat Pengiriman <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="shippingAddress"
                        placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos)"
                        value={shippingAddress}
                        onChange={(e) => {
                          setShippingAddress(e.target.value);
                          if (useSavedAddress) setUseSavedAddress(false);
                        }}
                        className="mt-2 min-h-[100px] rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-gray-700 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Catatan (Opsional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Tambahkan catatan untuk penjual"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-32 border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-5">Ringkasan Pesanan</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} produk)</span>
                    <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-emerald-500 font-semibold">GRATIS</span>
                  </div>
                  {subscriptions.filter(s => s.enabled).length > 0 && (
                    <div className="flex justify-between items-center bg-violet-50 px-3 py-2 rounded-lg">
                      <span className="flex items-center gap-2 text-violet-600 text-sm">
                        <RefreshCw className="w-4 h-4" />
                        Langganan
                      </span>
                      <span className="font-semibold text-violet-700">{subscriptions.filter(s => s.enabled).length} item</span>
                    </div>
                  )}
                  <div className="border-t border-dashed pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total Bayar</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {isAuthenticated ? (
                  <>
                    {!shippingAddress.trim() && (
                      <p className="text-sm text-amber-500 mb-4 flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                        <MapPin className="w-4 h-4" />
                        Isi alamat pengiriman untuk checkout
                      </p>
                    )}
                    <Button
                      className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg font-semibold shadow-xl shadow-emerald-500/25 rounded-xl"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !shippingAddress.trim()}
                    >
                      {isCheckingOut ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Checkout Sekarang
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Link href={ROUTES.LOGIN} className="block">
                    <Button className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg font-semibold shadow-xl shadow-emerald-500/25 rounded-xl">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login untuk Checkout
                    </Button>
                  </Link>
                )}
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                <p className="text-sm text-emerald-700 flex items-center gap-2">
                  <span className="text-lg">🌱</span> Produk segar langsung dari petani lokal
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

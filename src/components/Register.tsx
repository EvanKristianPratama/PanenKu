'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Sprout, Mail, Lock, User, ArrowRight, Check, Leaf, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=1920',
    title: 'Bergabung Bersama Kami',
    subtitle: 'Nikmati produk segar setiap hari'
  },
  {
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1920',
    title: 'Sayuran Hidroponik',
    subtitle: 'Kualitas premium untuk kesehatan'
  },
  {
    url: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=1920',
    title: 'Buah Tropis Segar',
    subtitle: 'Dipetik langsung dari kebun'
  },
  {
    url: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?q=80&w=1920',
    title: 'Produk Organik',
    subtitle: 'Tanpa pestisida berbahaya'
  }
];

const benefits = [
  'Gratis ongkir untuk pesanan pertama',
  'Akses ke produk eksklusif',
  'Notifikasi promo spesial',
  'Poin reward setiap pembelian'
];

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          await getSession();
          toast.success('Registrasi berhasil! Selamat datang!');
          router.push('/');
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Gagal mendaftar');
      }
    } catch (error) {
      setError('Terjadi kesalahan');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PanenKu</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru 🌱</h2>
            <p className="text-gray-500">Daftar untuk mulai berbelanja</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 bg-white border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-white border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 bg-white border-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Konfirmasi</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 bg-white border-gray-200"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-medium shadow-lg shadow-green-500/25 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Dynamic Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/80 via-green-800/70 to-green-700/60 z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-between p-12 text-white h-full">
          {/* Top - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sprout className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">PanenKu</span>
          </div>

          {/* Center - Benefits */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight">
                {heroImages[currentImage].title}
              </h1>
              <p className="text-xl text-white/80">
                {heroImages[currentImage].subtitle}
              </p>
            </div>

            {/* Benefit List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <p className="text-sm text-white/70 uppercase tracking-wider">Keuntungan Member</p>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-900" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom - Image Indicators */}
          <div className="flex items-center gap-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage
                    ? 'w-8 bg-white'
                    : 'w-4 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

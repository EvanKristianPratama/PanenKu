'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Sprout, Mail, Lock, ArrowRight, Leaf, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1920',
    title: 'Sayuran Segar',
    subtitle: 'Langsung dari kebun petani lokal'
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1920',
    title: 'Hasil Tani Berkualitas',
    subtitle: 'Dipanen segar setiap hari'
  },
  {
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1920',
    title: 'Buah-buahan Pilihan',
    subtitle: 'Manis dan bergizi tinggi'
  },
  {
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920',
    title: 'Bahan Makanan Organik',
    subtitle: 'Sehat untuk keluarga Anda'
  }
];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success(`Selamat datang!`);
        const session = await getSession();
        if ((session?.user as any)?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        toast.error('Email atau password salah');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Dynamic Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-700/60 z-10" />
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

          {/* Center - Dynamic Title */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold leading-tight">
                {heroImages[currentImage].title}
              </h1>
              <p className="text-xl text-white/80">
                {heroImages[currentImage].subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Leaf className="w-4 h-4" />
                <span className="text-sm">100% Organik</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Truck className="w-4 h-4" />
                <span className="text-sm">Gratis Ongkir</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Garansi Segar</span>
              </div>
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

      {/* Right side - Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang! 👋</h2>
            <p className="text-gray-500">Masuk untuk melanjutkan belanja</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="pl-11 h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

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
                  className="pl-11 h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-medium shadow-lg shadow-green-500/25"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-center text-xs text-gray-400 mb-4">Dipercaya oleh ribuan pelanggan</p>
            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">10K+</p>
                <p className="text-xs text-gray-500">Pelanggan</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">50+</p>
                <p className="text-xs text-gray-500">Petani</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">4.9⭐</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

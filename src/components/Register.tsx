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
    <div className="min-h-screen w-full flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PanenKu</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Buat Akun Baru 🌱</h2>
            <p className="text-gray-500 text-lg">Mulai perjalanan belanja segar Anda</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-600" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jhon Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-600" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Konfirmasi</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-600" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mendaftar...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">Atau</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-all rounded-xl flex items-center justify-center gap-3"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-gray-700">Daftar dengan Google</span>
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline inline-flex items-center gap-1">
                Masuk Disini
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Dynamic Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-green-900">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100 ease-out' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-900/40 to-transparent z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover transform scale-105"
            />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-between p-10 xl:p-16 text-white h-full w-full">
          {/* Top - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PanenKu</span>
          </div>

          {/* Center - Benefits */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                {heroImages[currentImage].title}
              </h1>
              <p className="text-lg text-green-50 font-light max-w-md leading-relaxed">
                {heroImages[currentImage].subtitle}
              </p>
            </div>

            {/* Benefit List */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/10 shadow-2xl shadow-green-900/20">
              <p className="text-xs text-green-200 font-bold uppercase tracking-widest mb-2">Member Benefits</p>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:bg-green-400 transition-colors">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white/90">{benefit}</span>
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
                className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentImage
                  ? 'w-12 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">Atau</span>
            </div>
          </div>

          <div className="text-center">
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

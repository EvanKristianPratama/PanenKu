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
        const session = await getSession();
        toast.success(`Selamat datang, ${(session?.user as any)?.name || 'User'}!`);

        const role = (session?.user as any)?.role;
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'farmer') {
          router.push('/mitra');
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
    <div className="min-h-screen w-full flex">
      {/* Left side - Dynamic Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100 ease-out' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
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
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PanenKu</span>
          </div>

          {/* Center - Dynamic Title */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                {heroImages[currentImage].title}
              </h1>
              <p className="text-lg text-gray-300 font-light max-w-md leading-relaxed">
                {heroImages[currentImage].subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Leaf, text: "100% Organik" },
                { icon: Truck, text: "Gratis Ongkir" },
                { icon: Shield, text: "Garansi Segar" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                  <feature.icon className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom - Image Indicators */}
          <div className="flex items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentImage
                  ? 'w-10 bg-green-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang Kembali! 👋</h2>
            <p className="text-gray-500 text-lg">Masuk ke akun Anda untuk mulai belanja.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-600" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Masuk Sekarang
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
              Belum punya akun?{' '}
              <Link href="/register" className="text-green-600 font-bold hover:text-green-700 hover:underline inline-flex items-center gap-1">
                Daftar Gratis
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

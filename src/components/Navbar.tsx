'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Sprout, User, LogOut, Menu, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { CartPreview } from './CartPreview';

export function Navbar() {
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Scrolling down - hide
      } else {
        setIsVisible(true); // Scrolling up - show
      }

      // Add background when scrolled
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    signOut({ callbackUrl: window.location.origin + '/login' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100'
          : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200'
              : (session && pathname === '/') ? 'bg-white/20 backdrop-blur-sm' : 'bg-green-100'
              }`}>
              <Sprout className={`w-5 h-5 transition-colors ${isScrolled ? 'text-white' : (session && pathname === '/') ? 'text-white' : 'text-green-600'
                }`} />
            </div>
            <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : (session && pathname === '/') ? 'text-white' : 'text-green-700'
              }`}>
              PanenKu
            </span>
          </Link>

          {/* Right side items */}
          <div className="flex items-center gap-2">
            {/* Admin Link */}
            {(session?.user as any)?.role === 'admin' && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-colors ${isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : (session && pathname === '/') ? 'text-white hover:bg-white/20' : 'text-green-700 hover:text-green-900 hover:bg-green-100'
                    } ${pathname?.startsWith('/admin') ? 'font-medium' : ''}`}
                >
                  Admin
                </Button>
              </Link>
            )}

            {/* Farmer/Mitra Dashboard Link */}
            {(session?.user as any)?.role === 'farmer' && (
              <Link href="/mitra">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-colors ${isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : (session && pathname === '/') ? 'text-white hover:bg-white/20' : 'text-green-700 hover:text-green-900 hover:bg-green-100'
                    } ${pathname?.startsWith('/mitra') ? 'font-medium bg-green-100' : ''}`}
                >
                  🌾 Petani Dashboard
                </Button>
              </Link>
            )}

            {/* Cart Preview - Only show when logged in */}
            {session && (
              <CartPreview
                isScrolled={isScrolled}
                isLoggedIn={!!session && pathname === '/'}
              />
            )}

            {/* User Menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 transition-colors ${isScrolled
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : (session && pathname === '/') ? 'text-white hover:bg-white/20' : 'text-green-700 hover:text-green-900 hover:bg-green-100'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${isScrolled
                      ? 'bg-green-100 text-green-700'
                      : (session && pathname === '/')
                        ? 'bg-white/30 text-white'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{session.user.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 mt-2">
                  <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate bg-transparent">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate bg-transparent">{session.user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md p-2 hover:bg-green-50 focus:bg-green-50 focus:text-green-700">
                    <Link href="/profile" className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profil Saya</p>
                        <p className="text-[10px] text-gray-500">Lihat biodata diri</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md p-2 hover:bg-green-50 focus:bg-green-50 focus:text-green-700">
                    <Link href="/orders" className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pesanan Saya</p>
                        <p className="text-[10px] text-gray-500">Cek status pesanan</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2.5 rounded-md p-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className={`transition-all ${isScrolled
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

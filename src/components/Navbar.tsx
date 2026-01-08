'use client';

import { ShoppingCart, Sprout, User, LogOut } from 'lucide-react';
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

export function Navbar() {
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: window.location.origin + '/login' });
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Sprout className="w-8 h-8" />
            <span className="text-2xl font-bold">PanenKu</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* <Link
              href="/"
              className={`hover:text-green-100 transition-colors ${pathname === '/' ? 'text-white font-medium' : 'text-green-200'
                }`}
            >
              Produk
            </Link> */}

            {(session?.user as any)?.role === 'admin' && (
              <Link
                href="/admin"
                className={`hover:text-green-100 transition-colors ${pathname?.startsWith('/admin') ? 'text-white font-medium' : 'text-green-200'
                  }`}
              >
                Admin
              </Link>
            )}

            <Link
              href="/cart"
              className="relative hover:text-green-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 px-2 py-0 min-w-[20px] h-5 flex items-center justify-center border-none">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-green-700 text-white hover:text-white border-transparent">
                    <User className="w-5 h-5 mr-2" />
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center text-gray-600 w-full">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/orders" className="flex items-center text-gray-600 w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Pesanan Saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
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

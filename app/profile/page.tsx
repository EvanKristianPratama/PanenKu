'use client';

import { useSession, signOut } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut, ShoppingBag, Heart, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    const handleLogout = () => {
        signOut({ callbackUrl: window.location.origin + '/login' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <User className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{session.user?.name}</h1>
                            <p className="text-green-100">{session.user?.email}</p>
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mt-2">
                                <Shield className="w-4 h-4" />
                                {(session.user as any)?.role === 'admin' ? 'Administrator' : 'Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Menu */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 mb-4">Menu</h3>

                            <Link href="/cart" className="block">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Keranjang</p>
                                            <p className="text-sm text-gray-500">Lihat keranjang belanja</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm opacity-50">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Wishlist</p>
                                        <p className="text-sm text-gray-500">Coming soon</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm opacity-50">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Pengaturan</p>
                                        <p className="text-sm text-gray-500">Coming soon</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Info */}
                        <div className="md:col-span-2">
                            <h3 className="font-semibold text-gray-700 mb-4">Informasi Akun</h3>

                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                                            <p className="font-medium">{session.user?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{session.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Role</p>
                                            <p className="font-medium capitalize">{(session.user as any)?.role || 'User'}</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Keluar dari Akun
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

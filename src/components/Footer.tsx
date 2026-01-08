import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sprout } from 'lucide-react';
import packageJson from '../../package.json';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                                <Sprout className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                                PanenKu
                            </span>
                        </div>
                        <p className="text-gray-500 leading-relaxed">
                            Platform marketplace pertanian modern yang menghubungkan petani lokal langsung dengan konsumen. Segar, Berkualitas, dan Menyejahterakan.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Bantuan</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-green-600 transition-colors inline-block">
                                    Cara Belanja
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-green-600 transition-colors inline-block">
                                    Pengiriman
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-green-600 transition-colors inline-block">
                                    Pengembalian Barang
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-green-600 transition-colors inline-block">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-500">
                                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Bandung, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500">
                                <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <a href="mailto:evankristian03@gmail.com" className="hover:text-green-600 transition-colors">
                                    evankristian03@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500">
                                <Instagram className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <a href="https://instagram.com/evankristiannn" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                                    @evankristiannn
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter or Info */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Informasi</h3>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-semibold text-green-800 mb-2">Punya pertanyaan?</h4>
                            <p className="text-sm text-gray-500 mb-4">Tim support kami siap membantu Anda 24/7 untuk pengalaman belanja terbaik.</p>
                            <button className="w-full bg-white border border-green-200 text-green-700 font-medium py-2.5 rounded-xl hover:bg-green-50 transition-colors text-sm">
                                Chat WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                © 2026 <span className="font-semibold text-gray-900">PanenKu</span>. All rights reserved.
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                Created with ❤️ by <span className="font-medium text-gray-600">Evan Kristian Pratama</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                v{packageJson.version}
                            </span>
                            <div className="flex gap-4 text-sm text-gray-400">
                                <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                                <a href="#" className="hover:text-gray-600">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import Link from 'next/link';
import { Instagram, Linkedin, Mail, Phone, MapPin, Sprout, Github, MessageCircle } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PanenKu</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5">
                            Marketplace pertanian modern yang menghubungkan petani lokal langsung dengan konsumen.
                        </p>
                        <a
                            href="https://wa.me/6287779511667"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat WhatsApp
                        </a>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Bantuan</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Cara Belanja', href: '/help?tab=shopping' },
                                { label: 'Pengiriman', href: '/help?tab=shipping' },
                                { label: 'Pengembalian', href: '/help?tab=returns' },
                                { label: 'FAQ', href: '/help?tab=faq' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Kontak</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="https://wa.me/6287779511667" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-gray-500 hover:text-green-600 text-sm transition-colors">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    +62 877-7951-1667
                                </a>
                            </li>
                            <li>
                                <a href="mailto:evankristian03@gmail.com" className="flex items-center gap-2.5 text-gray-500 hover:text-green-600 text-sm transition-colors">
                                    <Mail className="w-4 h-4 text-green-600" />
                                    evankristian03@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                                <MapPin className="w-4 h-4 text-green-600" />
                                Bandung, Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Sosial Media</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/evankristiannn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/evan-pratama-196119271/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/EvanKristianPratama"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2026 PanenKu. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-xs">
                        Created with ❤️ by <span className="font-medium text-gray-500">Evan Kristian Pratama</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

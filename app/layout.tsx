import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PanenKu - Marketplace Pertanian",
    description: "Belanja sayur dan buah segar langsung dari petani",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Footer />
                    <Toaster position="top-center" />
                </Providers>
            </body>
        </html>
    );
}

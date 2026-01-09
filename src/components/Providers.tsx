'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

import { useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PresenceListener } from "./PresenceListener";

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Sign in anonymously to Firebase to satisfy "request.auth != null" rules
        signInAnonymously(auth).catch((error) => {
            console.error("Failed to sign in anonymously to Firebase:", error);
        });
    }, []);

    return (
        <SessionProvider>
            <CartProvider>
                <PresenceListener />
                {children}
            </CartProvider>
        </SessionProvider>
    );
}

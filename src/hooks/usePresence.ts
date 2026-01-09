import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { chatService } from '@/services/chatService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function usePresence(userId?: string) {
    const { data: session } = useSession();
    const currentUserId = (session?.user as any)?.id as string | undefined;

    const [isOnline, setIsOnline] = useState(false);
    const [lastSeen, setLastSeen] = useState<Date | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Track Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthReady(true);
            } else {
                setIsAuthReady(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Update own status when connected and auth is ready
    useEffect(() => {
        if (!currentUserId || !isAuthReady) return;

        // Set online
        chatService.updateUserStatus(currentUserId, true);

        // Set offline on unload
        const handleUnload = () => {
            chatService.updateUserStatus(currentUserId, false);
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            // Set offline when unmounting
            chatService.updateUserStatus(currentUserId, false);
        };
    }, [currentUserId, isAuthReady]);

    // Listen to OTHER user's status if userId is provided and auth is ready
    useEffect(() => {
        if (!userId || !isAuthReady) return;

        const unsubscribe = chatService.listenToUserStatus(userId, (status) => {
            setIsOnline(status.isOnline);
            setLastSeen(status.lastSeen ? status.lastSeen.toDate() : null);
        });

        return () => unsubscribe();
    }, [userId, isAuthReady]);

    return { isOnline, lastSeen };
}

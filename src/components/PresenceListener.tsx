'use client';

import { usePresence } from '@/hooks/usePresence';

export function PresenceListener() {
    // This hook automatically updates the current user's status in Firestore
    // when they are logged in and the component is mounted.
    usePresence();

    return null; // This component renders nothing
}

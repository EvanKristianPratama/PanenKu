'use client';

import { useState, useEffect } from 'react';
import { chatService } from '@/services/chatService';
import { ChatRoom } from '@/types';
import { useChat } from './useChat';

/**
 * Hook for subscribing to user's chat rooms
 * Single Responsibility: Room list subscription only
 */
export function useChatRooms() {
    const { userId } = useChat();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setRooms([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = chatService.subscribeToRooms(userId, (fetchedRooms) => {
            setRooms(fetchedRooms);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    /**
     * Get the other participant's name in a room
     */
    const getOtherParticipantName = (room: ChatRoom): string => {
        const otherId = room.participants.find(id => id !== String(userId));
        if (!otherId) return 'Unknown';
        return room.participantNames[otherId] || 'User';
    };

    return { rooms, loading, getOtherParticipantName };
}

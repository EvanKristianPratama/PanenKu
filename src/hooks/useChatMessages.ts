'use client';

import { useState, useEffect } from 'react';
import { chatService } from '@/services/chatService';
import { ChatMessage } from '@/types';

/**
 * Hook for subscribing to messages in a chat room
 * Single Responsibility: Message subscription only
 */
export function useChatMessages(roomId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) {
            setMessages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = chatService.subscribeToMessages(roomId, (msgs) => {
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);

    return { messages, loading };
}

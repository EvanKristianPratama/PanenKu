'use client';

import { useSession } from 'next-auth/react';
import { chatService } from '@/services/chatService';
import { ChatRoom } from '@/types';

/**
 * Hook for chat operations (creating rooms, sending messages)
 * Single Responsibility: Manage chat actions
 */
export function useChat() {
    const { data: session } = useSession();

    const userId = (session?.user as any)?.id as string | undefined;
    const userName = session?.user?.name || 'User';
    const isAuthenticated = !!session?.user && !!userId;

    /**
     * Create a support chat room with Admin
     */
    const createSupportChat = async (): Promise<ChatRoom | null> => {
        if (!userId) return null;

        try {
            const res = await fetch('/api/contact/admin');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const adminId = data.id;
            if (userId === adminId) return null; // Can't chat with self

            const participants = [String(userId), String(adminId)];
            const participantNames = {
                [String(userId)]: userName,
                [String(adminId)]: 'Admin Support'
            };

            return await chatService.createRoom(
                participants,
                participantNames,
                'support',
                { productName: 'Bantuan & Support' }
            );
        } catch (error) {
            console.error('Failed to create support chat:', error);
            return null;
        }
    };

    /**
     * Create a product inquiry chat with a farmer
     */
    const createProductChat = async (
        farmerId: string,
        farmerName: string,
        productId: string,
        productName: string
    ): Promise<ChatRoom | null> => {
        if (!userId || userId === farmerId) return null;

        const participants = [String(userId), String(farmerId)];
        const participantNames = {
            [String(userId)]: userName,
            [String(farmerId)]: farmerName
        };

        try {
            return await chatService.createRoom(
                participants,
                participantNames,
                'product_inquiry',
                { productId, productName }
            );
        } catch (error) {
            console.error('Failed to create product chat:', error);
            return null;
        }
    };

    /**
     * Send a message to a room
     */
    const sendMessage = async (roomId: string, content: string): Promise<boolean> => {
        if (!userId || !content.trim()) return false;

        try {
            await chatService.sendMessage(roomId, userId, userName, content);
            return true;
        } catch (error) {
            console.error('Failed to send message:', error);
            return false;
        }
    };

    return {
        userId,
        userName,
        isAuthenticated,
        createSupportChat,
        createProductChat,
        sendMessage
    };
}

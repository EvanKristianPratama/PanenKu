'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from './useChat';
import { ChatRoom } from '@/types';
import { showAlert } from '@/lib/sweetalert';
import { ROUTES } from '@/constants/routes';
import { MESSAGES } from '@/constants/messages';

interface FarmerChatParams {
  farmerId: string | undefined;
  farmerName: string;
  productId: string | number;
  productName: string;
}

interface UseFarmerChatReturn {
  activeChatRoom: ChatRoom | null;
  isLoading: boolean;
  openFarmerChat: () => Promise<void>;
  closeFarmerChat: () => void;
}

/**
 * Hook untuk mengelola chat dengan petani/farmer
 * Digunakan di ProductDetail untuk berkomunikasi dengan penjual
 */
export function useFarmerChat({
  farmerId,
  farmerName,
  productId,
  productName,
}: FarmerChatParams): UseFarmerChatReturn {
  const router = useRouter();
  const { createProductChat, isAuthenticated } = useChat();
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openFarmerChat = useCallback(async () => {
    // Check authentication
    if (!isAuthenticated) {
      showAlert.error(MESSAGES.AUTH.LOGIN_REQUIRED_TITLE, MESSAGES.AUTH.LOGIN_REQUIRED_CHAT);
      router.push(ROUTES.LOGIN);
      return;
    }

    // Check farmer info
    if (!farmerId) {
      showAlert.error('Error', 'Informasi petani tidak lengkap');
      return;
    }

    setIsLoading(true);
    try {
      const room = await createProductChat(
        farmerId,
        farmerName,
        String(productId),
        productName
      );

      if (room) {
        setActiveChatRoom(room);
      } else {
        showAlert.error('Info', 'Tidak dapat memulai chat');
      }
    } catch (error) {
      console.error('Chat error:', error);
      showAlert.error('Gagal Memulai Chat', 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, farmerId, farmerName, productId, productName, createProductChat, router]);

  const closeFarmerChat = useCallback(() => {
    setActiveChatRoom(null);
  }, []);

  return {
    activeChatRoom,
    isLoading,
    openFarmerChat,
    closeFarmerChat,
  };
}

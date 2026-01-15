'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useChat } from './useChat';
import { ChatRoom } from '@/types';
import { showAlert } from '@/lib/sweetalert';
import { MESSAGES } from '@/constants/messages';

// ============================================
// Types
// ============================================
interface UseSupportChatReturn {
  activeChatRoom: ChatRoom | null;
  openSupportChat: () => Promise<void>;
  closeSupportChat: () => void;
  isLoading: boolean;
}

// ============================================
// Hook
// ============================================
/**
 * Hook untuk handle support chat dengan admin
 */
export function useSupportChat(): UseSupportChatReturn {
  const { isAuthenticated } = useAuth();
  const { createSupportChat } = useChat();
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openSupportChat = useCallback(async () => {
    if (!isAuthenticated) {
      showAlert.error('Login Diperlukan', MESSAGES.AUTH.LOGIN_REQUIRED);
      return;
    }

    setIsLoading(true);
    try {
      const room = await createSupportChat();
      if (room) {
        setActiveChatRoom(room);
      } else {
        showAlert.info('Info', 'Tidak dapat memulai chat');
      }
    } catch (error) {
      console.error('Support chat error:', error);
      showAlert.error('Gagal', MESSAGES.CHAT.START_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, createSupportChat]);

  const closeSupportChat = useCallback(() => {
    setActiveChatRoom(null);
  }, []);

  return {
    activeChatRoom,
    openSupportChat,
    closeSupportChat,
    isLoading,
  };
}

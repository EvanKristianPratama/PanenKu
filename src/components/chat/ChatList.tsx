'use client';

import { useState } from 'react';
import { ChatRoom } from '@/types';
import { useChatRooms } from '@/hooks/useChatRooms';
import { useChat } from '@/hooks/useChat';
import { ChatBox } from './ChatBox';
import { MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

/**
 * ChatList Component - Dashboard view for managing conversations
 * Clean UI, logic in hooks
 */
export function ChatList() {
    const { userId, isAuthenticated } = useChat();
    const { rooms, loading, getOtherParticipantName } = useChatRooms();
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);

    if (!isAuthenticated) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                <p className="font-bold">Error: Sesi tidak valid</p>
                <p className="text-sm">ID Pengguna tidak ditemukan. Silakan logout dan login kembali.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        Pesan
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Belum ada percakapan
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setActiveRoom(room)}
                                className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${activeRoom?.id === room.id ? 'bg-white border-l-4 border-l-green-600' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-gray-900 truncate">
                                        {getOtherParticipantName(room)}
                                    </span>
                                    {room.lastMessageTime && (
                                        <span className="text-[10px] text-gray-400">
                                            {format(room.lastMessageTime.toDate(), 'dd/MM HH:mm')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                    {room.lastMessage || 'Mulai percakapan...'}
                                </div>
                                {room.metadata?.productName && (
                                    <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                                        Product: {room.metadata.productName}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative bg-gray-100">
                {activeRoom ? (
                    <div className="absolute inset-0">
                        <ChatBox
                            room={activeRoom}
                            onClose={() => setActiveRoom(null)}
                            embedded={true}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-3">
                        <MessageCircle className="w-12 h-12 opacity-20" />
                        <p>Pilih percakapan untuk melihat pesan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

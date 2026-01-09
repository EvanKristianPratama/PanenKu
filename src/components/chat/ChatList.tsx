'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { chatService } from '@/services/chatService';
import { ChatRoom } from '@/types';
import { format } from 'date-fns';
import { ChatBox } from './ChatBox';
import { MessageCircle, User } from 'lucide-react';

export function ChatList() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);

    useEffect(() => {
        if (!session?.user) return;

        const userId = (session.user as any).id;
        const unsubscribe = chatService.subscribeToRooms(userId, (fetchedRooms) => {
            setRooms(fetchedRooms);
        });

        return () => unsubscribe();
    }, [session]);

    if (!session) return null;

    const userId = (session.user as any).id;

    if (!userId) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                <p className="font-bold">Error: Sesi tidak valid</p>
                <p className="text-sm">ID Pengguna tidak ditemukan. Silakan logout dan login kembali.</p>
            </div>
        );
    }

    const getOtherParticipantName = (room: ChatRoom) => {
        // Find ID that is not mine
        const otherId = room.participants.find(id => id !== String(userId));
        if (!otherId) return 'Unknown';
        return room.participantNames[otherId] || 'User';
    };

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
                    {rooms.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Belum ada percakapan
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setActiveRoom(room)}
                                className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${activeRoom?.id === room.id ? 'bg-white border-l-4 border-l-green-600' : ''}`}
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
                        {/* Reusing ChatBox logic but simplified for embedding?? 
                             Actually ChatBox is fixed position. I should make it adaptable or just use a relative version.
                             For KISS, I'll modify ChatBox to accept 'embedded' prop or just use it as is (it's fixed though).
                             
                             Better: Create a distinct view here or refactor ChatBox to be container-agnostic.
                             I'll quickly refactor ChatBox to accept 'className' or 'style' to override fixed positioning.
                         */}
                        <EmbeddedChatBox room={activeRoom} />
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

// Temporary internal component until I refactor ChatBox properly
// Logic is identical to ChatBox but layout is relative for dashboard
function EmbeddedChatBox({ room }: { room: ChatRoom }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    // ... logic same as ChatBox ...
    // To save time and keep it DRY, ideally I'd import. But for speed now I'll use the service directly here.

    useEffect(() => {
        const unsubscribe = chatService.subscribeToMessages(room.id, (msgs) => setMessages(msgs));
        return () => unsubscribe();
    }, [room.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user) return;
        await chatService.sendMessage(room.id, String((session.user as any).id), session.user.name || 'User', newMessage);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold">{room.metadata?.productName || 'Chat'}</h3>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col-reverse">
                {/* flex-col-reverse to keep scroll at bottom? No, standard is easier */}
                <div className="flex flex-col space-y-4 justify-end min-h-full">
                    {messages.map(msg => {
                        const isMe = String(msg.senderId) === String((session?.user as any)?.id);
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2 rounded-xl ${isMe ? 'bg-green-600 text-white' : 'bg-white border text-gray-800'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
                <input
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                    <MessageCircle className="w-5 h-5" />
                </button>
            </form>
        </div>
    )
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatService } from '@/services/chatService';
import { ChatMessage, ChatRoom } from '@/types';
import { format } from 'date-fns';

interface ChatBoxProps {
    room: ChatRoom;
    onClose: () => void;
    onMinimize?: () => void;
}

export function ChatBox({ room, onClose, onMinimize }: ChatBoxProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const unsubscribe = chatService.subscribeToMessages(room.id, (msgs) => {
            setMessages(msgs);
            // Auto scroll to bottom
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        });

        return () => unsubscribe();
    }, [room.id]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !session?.user) return;

        try {
            await chatService.sendMessage(
                room.id,
                String(session.user.id), // Ensure ID is string
                session.user.name || 'User',
                newMessage
            );
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 w-72 bg-white rounded-t-xl shadow-2xl border border-gray-200 z-50 cursor-pointer" onClick={() => setIsMinimized(false)}>
                <div className="bg-green-600 p-3 rounded-t-xl flex items-center justify-between text-white">
                    <span className="font-semibold truncate">
                        {room.metadata?.productName ? `${room.metadata.productName}` : 'Chat'}
                    </span>
                    <div className="flex gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <X className="w-4 h-4 hover:bg-green-700 rounded" onClick={(e) => { e.stopPropagation(); onClose(); }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-green-600 p-3 rounded-t-xl flex items-center justify-between text-white shrink-0">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                        {room.metadata?.productName || 'Chat Support'}
                    </p>
                    <p className="text-xs text-green-100 truncate">
                        {/* Logic to show other participant's name could go here */}
                        ID: {room.id.substring(0, 6)}...
                    </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-green-700 rounded transition">
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-green-700 rounded transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-10">
                        Belum ada pesan. Mulai percakapan sekarang!
                    </div>
                ) : (
                    messages.map((msg) => {
                        // Check if current user is sender
                        const isMe = String(msg.senderId) === String(session?.user?.id);
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isMe
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm') : 'Sending...'}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t rounded-b-xl shrink-0 flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-green-500 rounded-full px-4"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 rounded-full w-10 h-10 shrink-0"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}

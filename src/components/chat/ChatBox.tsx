'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatRoom } from '@/types';
import { useChat } from '@/hooks/useChat';
import { useChatMessages } from '@/hooks/useChatMessages';
import { format } from 'date-fns';

interface ChatBoxProps {
    room: ChatRoom;
    onClose: () => void;
    embedded?: boolean; // For dashboard usage (not fixed position)
}

/**
 * ChatBox Component - Clean UI only, logic in hooks
 * Supports both floating (fixed) and embedded (relative) modes
 */
export function ChatBox({ room, onClose, embedded = false }: ChatBoxProps) {
    const { userId, sendMessage } = useChat();
    const { messages } = useChatMessages(room.id);
    const [newMessage, setNewMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;

        const success = await sendMessage(room.id, newMessage);
        if (success) setNewMessage('');
    };

    // Minimized state (only for floating mode)
    if (!embedded && isMinimized) {
        return (
            <div
                className="fixed bottom-4 right-4 w-72 bg-white rounded-t-xl shadow-2xl border border-gray-200 z-50 cursor-pointer"
                onClick={() => setIsMinimized(false)}
            >
                <div className="bg-green-600 p-3 rounded-t-xl flex items-center justify-between text-white">
                    <span className="font-semibold truncate">
                        {room.metadata?.productName || 'Chat'}
                    </span>
                    <div className="flex gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <X
                            className="w-4 h-4 hover:bg-green-700 rounded"
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Container classes based on mode
    const containerClass = embedded
        ? "flex flex-col h-full bg-white"
        : "fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col h-[500px]";

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="bg-green-600 p-3 rounded-t-xl flex items-center justify-between text-white shrink-0">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                        {room.metadata?.productName || 'Chat Support'}
                    </p>
                    <p className="text-xs text-green-100 truncate">
                        ID: {room.id.substring(0, 6)}...
                    </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                    {!embedded && (
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1 hover:bg-green-700 rounded transition"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    )}
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
                        const isMe = String(msg.senderId) === String(userId);
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

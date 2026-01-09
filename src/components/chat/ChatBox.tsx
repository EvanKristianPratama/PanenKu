'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatRoom } from '@/types';
import { useChat } from '@/hooks/useChat';
import { useChatMessages } from '@/hooks/useChatMessages';
import { usePresence } from '@/hooks/usePresence';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

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

    // Identify other participant
    const otherUserId = room.participants.find(id => id !== userId);
    // Get their status
    const { isOnline, lastSeen } = usePresence(otherUserId);

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

    const getStatusText = () => {
        if (isOnline) return 'Online';
        if (lastSeen) {
            return `Active ${format(lastSeen, 'HH:mm', { locale: idLocale })}`;
        }
        return 'Offline';
    };

    // Minimized state (floating only)
    if (!embedded && isMinimized) {
        return (
            <div
                className="fixed bottom-6 right-6 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-50 cursor-pointer hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/5"
                onClick={() => setIsMinimized(false)}
            >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="flex h-3 w-3 relative">
                                {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                            </span>
                        </div>
                        <span className="font-semibold truncate text-sm">
                            {room.metadata?.productName || 'Chat Support'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const containerClass = embedded
        ? "flex flex-col h-full bg-gray-50/50"
        : "fixed bottom-6 right-6 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 z-50 flex flex-col h-[600px] ring-1 ring-black/5 transition-all duration-300";

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-t-3xl border-b border-gray-100/50 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-sm border border-white">
                            {room.metadata?.productName?.charAt(0) || 'C'}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full p-0.5"></span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-sm">
                            {room.metadata?.productName || 'Chat Support'}
                        </h3>
                        <p className={`text-xs truncate font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                            {getStatusText()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {!embedded && (
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Send className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Mulai percakapan sekarang!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = String(msg.senderId) === String(userId);
                        const isLast = index === messages.length - 1;

                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${isMe
                                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <span className={`text-[10px] mt-1 px-1 font-medium ${isMe ? 'text-emerald-600/70' : 'text-gray-400'}`}>
                                    {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm') : 'Sending...'}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 rounded-b-3xl">
                <div className="flex gap-2 items-end">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 rounded-2xl px-4 py-6 shadow-inner"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl w-12 h-12 shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}

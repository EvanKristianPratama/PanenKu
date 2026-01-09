import { ChatList } from '@/components/chat/ChatList';

export default function AdminMessagesPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Support & Chat</h1>
            <ChatList />
        </div>
    );
}

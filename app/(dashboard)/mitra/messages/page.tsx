import { ChatList } from '@/components/chat/ChatList';

export default function MitraMessagesPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Pesan Masuk</h1>
            <ChatList />
        </div>
    );
}

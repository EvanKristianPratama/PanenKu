import { db, auth } from '@/lib/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    doc,
    updateDoc,
    serverTimestamp,
    getDocs,
    limit,
    setDoc
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { ChatMessage, ChatRoom } from '@/types';

// Helper to ensure auth
const ensureAuth = async () => {
    if (!auth.currentUser) {
        await signInAnonymously(auth);
    }
    return auth.currentUser;
};

export const chatService = {
    // Create or get existing chat room
    createRoom: async (
        participants: string[],
        participantNames: { [key: string]: string },
        type: 'support' | 'product_inquiry',
        metadata?: any
    ) => {
        await ensureAuth();

        if (!participants || participants.some(p => !p)) {
            throw new Error("Invalid participants: " + JSON.stringify(participants));
        }
        // Check if room exists (simple check for now)
        // For scalability, you might want a composite key or a specialized lookup
        const q = query(
            collection(db, 'rooms'),
            where('participants', 'array-contains', participants[0]), // Check first participant logic
            where('type', '==', type)
        );

        const snapshot = await getDocs(q);
        let existingRoom: ChatRoom | null = null;

        // Client-side filtering for exact match of participants
        snapshot.forEach(doc => {
            const data = doc.data() as ChatRoom;
            const sortedA = [...data.participants].sort().join(',');
            const sortedB = [...participants].sort().join(',');
            if (sortedA === sortedB) {
                // Also check metadata match if product inquiry
                if (type === 'product_inquiry' && metadata?.productId) {
                    if (data.metadata?.productId === metadata.productId) {
                        existingRoom = { ...data, id: doc.id };
                    }
                } else {
                    existingRoom = { ...data, id: doc.id };
                }
            }
        });

        if (existingRoom) return existingRoom;

        // Create new room
        const roomRef = await addDoc(collection(db, 'rooms'), {
            participants,
            participantNames,
            type,
            metadata: metadata || {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            unreadCount: 0
        });

        return { id: roomRef.id, participants, participantNames, type, metadata };
    },

    // Send a message
    sendMessage: async (roomId: string, senderId: string, senderName: string, content: string) => {
        await ensureAuth();
        const messageRef = await addDoc(collection(db, `rooms/${roomId}/messages`), {
            senderId,
            senderName,
            content,
            read: false,
            createdAt: serverTimestamp()
        });

        // Update room with last message
        await updateDoc(doc(db, 'rooms', roomId), {
            lastMessage: content,
            lastMessageTime: serverTimestamp(),
            // Simple logic: increment unread, but in reality needs per-user unread
            // For KISS, we'll just update updatedAt
        });

        return messageRef.id;
    },

    // Subscribe to messages in a room
    subscribeToMessages: (roomId: string, callback: (messages: ChatMessage[]) => void) => {
        const q = query(
            collection(db, `rooms/${roomId}/messages`),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatMessage));
            callback(messages);
        });
    },

    // Subscribe to user's chat rooms
    subscribeToRooms: (userId: string, callback: (rooms: ChatRoom[]) => void) => {
        if (!userId) return () => { }; // Return no-op unsubscribe
        const q = query(
            collection(db, 'rooms'),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc') // Requires index in Firestore usually
        );

        return onSnapshot(q, (snapshot) => {
            const rooms = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatRoom));
            callback(rooms);
        });
    },

    // User Presence / Status
    updateUserStatus: async (userId: string, isOnline: boolean) => {
        if (!userId) return;
        // Don't await ensureAuth here to prevent loops/blocking, just check
        if (!auth.currentUser) return;

        const statusRef = doc(db, 'status', userId);
        await setDoc(statusRef, {
            isOnline,
            lastSeen: serverTimestamp(),
            // We can add more info like currentRoomId if needed later
        }, { merge: true });
    },

    listenToUserStatus: (userId: string, callback: (status: { isOnline: boolean, lastSeen: any }) => void) => {
        if (!userId) return () => { };
        return onSnapshot(doc(db, 'status', userId), (doc) => {
            if (doc.exists()) {
                callback(doc.data() as any);
            } else {
                callback({ isOnline: false, lastSeen: null });
            }
        });
    }
};

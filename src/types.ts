export interface Product {
  id: string | number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  description: string;
  stock: number;
  farmer: string;
  farmerId?: string;
  location: string;
  soldCount?: number;
  createdAt?: string;
  // Harvest Date feature
  harvestDate?: string;
  harvestStatus?: 'ready' | 'growing' | 'pre-order';
  preOrderCount?: number;
  // Subscription feature
  isSubscribable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'farmer';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: any; // Firestore Timestamp
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[]; // [userId, farmerId] or [userId, adminId]
  participantNames: { [key: string]: string }; // { userId: 'User Name', farmerId: 'Farmer Name' }
  type: 'support' | 'product_inquiry';
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount?: number;
  metadata?: {
    productName?: string;
    productId?: string;
  };
}

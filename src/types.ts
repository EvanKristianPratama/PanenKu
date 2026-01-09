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
  role: 'admin' | 'user';
}

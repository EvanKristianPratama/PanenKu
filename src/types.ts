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

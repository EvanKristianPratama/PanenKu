import { Product, CartItem, User } from '@/types';
import { products } from '@/data/products';
import { users } from '@/data/users';
import { carts } from '@/data/cart';

// Current session user email (for cart tracking)
let currentUserEmail: string | null = null;

export const dummyService = {
    getProducts: async () => {
        return products;
    },

    getProduct: async (id: number) => {
        return products.find((p) => p.id === id) || null;
    },

    login: async (email: string, password: string) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUserEmail = user.email;
            return { user: { name: user.name, email: user.email }, role: user.role };
        }
        return { user: null, role: null };
    },

    register: async (name: string, email: string, password: string) => {
        // Check if email already exists
        const existing = users.find(u => u.email === email);
        if (existing) {
            throw new Error('Email sudah terdaftar');
        }

        const newUser: User = {
            id: users.length + 1,
            name,
            email,
            password,
            role: 'user'
        };
        users.push(newUser);
        currentUserEmail = email;
        return { user: { name, email }, role: 'user' };
    },

    logout: async () => {
        currentUserEmail = null;
    },

    addToCart: async (product: Product, quantity: number) => {
        if (!currentUserEmail) {
            currentUserEmail = 'guest';
        }
        if (!carts[currentUserEmail]) {
            carts[currentUserEmail] = [];
        }

        const cart = carts[currentUserEmail];
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
            existing.quantity = Math.min(existing.quantity + quantity, product.stock);
        } else {
            cart.push({ product, quantity });
        }
        return cart;
    },

    getCart: async () => {
        if (!currentUserEmail) {
            currentUserEmail = 'guest';
        }
        return carts[currentUserEmail] || [];
    },

    updateCartQuantity: async (productId: number, quantity: number) => {
        if (!currentUserEmail) return [];
        const cart = carts[currentUserEmail] || [];
        carts[currentUserEmail] = cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        return carts[currentUserEmail];
    },

    removeFromCart: async (productId: number) => {
        if (!currentUserEmail) return [];
        const cart = carts[currentUserEmail] || [];
        carts[currentUserEmail] = cart.filter((item) => item.product.id !== productId);
        return carts[currentUserEmail];
    },

    checkout: async () => {
        if (currentUserEmail) {
            carts[currentUserEmail] = [];
        }
        return true;
    },

    // Admin features
    addProduct: async (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: products.length + 1 };
        products.push(newProduct);
        return newProduct;
    },

    updateProduct: async (id: number, data: Partial<Product>) => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...data };
        }
        return products.find(p => p.id === id);
    },

    deleteProduct: async (id: number) => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
        }
        return true;
    },

    // User management (admin)
    getUsers: async () => {
        return users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
    }
};

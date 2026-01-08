import { connectDB } from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Product, IProduct } from '@/models/Product';
import { Cart, ICart } from '@/models/Cart';
import { Product as ProductType, CartItem } from '@/types';

// Current session user email (for cart tracking)
let currentUserEmail: string | null = null;

export const mongoService = {
    // Products
    getProducts: async (): Promise<ProductType[]> => {
        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        return products.map((p: any) => ({
            id: p._id.toString(),
            name: p.name,
            price: p.price,
            unit: p.unit,
            image: p.image,
            category: p.category,
            description: p.description,
            stock: p.stock,
            farmer: p.farmer,
            location: p.location,
            soldCount: p.soldCount || 0,
            createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
        }));
    },

    getProduct: async (id: string): Promise<ProductType | null> => {
        await connectDB();
        const product = await Product.findById(id).lean() as any;
        if (!product) return null;
        return {
            id: product._id.toString(),
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            category: product.category,
            description: product.description,
            stock: product.stock,
            farmer: product.farmer,
            location: product.location,
        };
    },

    // Auth
    login: async (email: string, password: string) => {
        await connectDB();
        const user = await User.findOne({ email, password }).lean() as any;
        if (user) {
            currentUserEmail = user.email;
            return { user: { name: user.name, email: user.email }, role: user.role };
        }
        return { user: null, role: null };
    },

    register: async (name: string, email: string, password: string) => {
        await connectDB();
        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('Email sudah terdaftar');
        }

        const newUser = await User.create({ name, email, password, role: 'user' });
        currentUserEmail = email;
        return { user: { name, email }, role: 'user' };
    },

    logout: async () => {
        currentUserEmail = null;
    },

    // Cart
    addToCart: async (product: ProductType, quantity: number) => {
        await connectDB();
        const email = currentUserEmail || 'guest';

        let cart = await Cart.findOne({ userEmail: email });
        if (!cart) {
            cart = await Cart.create({ userEmail: email, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === product.id
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = Math.min(
                cart.items[existingItemIndex].quantity + quantity,
                product.stock
            );
        } else {
            cart.items.push({ productId: product.id as any, quantity });
        }

        await cart.save();
        return await mongoService.getCart();
    },

    getCart: async (): Promise<CartItem[]> => {
        await connectDB();
        const email = currentUserEmail || 'guest';

        const cart = await Cart.findOne({ userEmail: email }).populate('items.productId');
        if (!cart) return [];

        return cart.items.map((item: any) => ({
            product: {
                id: item.productId._id.toString(),
                name: item.productId.name,
                price: item.productId.price,
                unit: item.productId.unit,
                image: item.productId.image,
                category: item.productId.category,
                description: item.productId.description,
                stock: item.productId.stock,
                farmer: item.productId.farmer,
                location: item.productId.location,
            },
            quantity: item.quantity,
        }));
    },

    updateCartQuantity: async (productId: string, quantity: number) => {
        await connectDB();
        const email = currentUserEmail || 'guest';

        await Cart.updateOne(
            { userEmail: email, 'items.productId': productId },
            { $set: { 'items.$.quantity': quantity } }
        );

        return await mongoService.getCart();
    },

    removeFromCart: async (productId: string) => {
        await connectDB();
        const email = currentUserEmail || 'guest';

        await Cart.updateOne(
            { userEmail: email },
            { $pull: { items: { productId } } }
        );

        return await mongoService.getCart();
    },

    checkout: async () => {
        await connectDB();
        const email = currentUserEmail || 'guest';
        await Cart.updateOne({ userEmail: email }, { $set: { items: [] } });
        return true;
    },

    // Admin features
    addProduct: async (product: Omit<ProductType, 'id'>) => {
        await connectDB();
        const newProduct = await Product.create(product);
        return {
            id: newProduct._id.toString(),
            ...product,
        };
    },

    updateProduct: async (id: string, data: Partial<ProductType>) => {
        await connectDB();
        const updated = await Product.findByIdAndUpdate(id, data, { new: true }).lean() as any;
        if (!updated) return null;
        return {
            id: updated._id.toString(),
            name: updated.name,
            price: updated.price,
            unit: updated.unit,
            image: updated.image,
            category: updated.category,
            description: updated.description,
            stock: updated.stock,
            farmer: updated.farmer,
            location: updated.location,
        };
    },

    deleteProduct: async (id: string) => {
        await connectDB();
        await Product.findByIdAndDelete(id);
        return true;
    },

    // User management
    getUsers: async () => {
        await connectDB();
        const users = await User.find().select('-password').lean();
        return users.map((u: any) => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
        }));
    },
};

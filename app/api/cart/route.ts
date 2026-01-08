import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";

// GET - Get user's cart
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ items: [] });
        }

        await connectDB();

        const cart = await Cart.findOne({ userEmail: session.user.email })
            .populate('items.productId');

        if (!cart) {
            return NextResponse.json({ items: [] });
        }

        const items = cart.items
            .filter((item: any) => item.productId) // Filter out null products
            .map((item: any) => ({
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
                    soldCount: item.productId.soldCount || 0,
                },
                quantity: item.quantity,
            }));

        return NextResponse.json({ items });
    } catch (error: any) {
        console.error('Get cart error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Add item to cart
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { productId, quantity = 1 } = await request.json();
        const userEmail = session.user.email;

        // Verify product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
        }
        if (product.stock < quantity) {
            return NextResponse.json({ error: "Stok tidak mencukupi" }, { status: 400 });
        }

        let cart = await Cart.findOne({ userEmail });

        if (!cart) {
            cart = await Cart.create({ userEmail, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            const newQuantity = Math.min(
                cart.items[existingItemIndex].quantity + quantity,
                product.stock
            );
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();

        return NextResponse.json({ success: true, message: "Produk ditambahkan ke keranjang" });
    } catch (error: any) {
        console.error('Add to cart error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update item quantity
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { productId, quantity } = await request.json();
        const userEmail = session.user.email;

        if (quantity < 1) {
            return NextResponse.json({ error: "Quantity harus minimal 1" }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
        }

        const finalQuantity = Math.min(quantity, product.stock);

        await Cart.updateOne(
            { userEmail, 'items.productId': productId },
            { $set: { 'items.$.quantity': finalQuantity } }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update cart error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove item from cart
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const userEmail = session.user.email;

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        await Cart.updateOne(
            { userEmail },
            { $pull: { items: { productId } } }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Remove from cart error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

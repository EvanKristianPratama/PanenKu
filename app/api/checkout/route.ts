import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Cart } from "@/models/Cart";

interface CartItemInput {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    unit: string;
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { items, shippingAddress, notes } = await request.json();
        const userEmail = session.user.email!;
        const userName = session.user.name!;

        // Validate cart items from request
        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
        }

        // Build order items and update stock
        const orderItems: CartItemInput[] = [];
        let totalAmount = 0;

        for (const item of items) {
            // Check stock availability
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json({ error: `Produk ${item.productName} tidak ditemukan` }, { status: 400 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({
                    error: `Stok ${item.productName} tidak mencukupi. Tersedia: ${product.stock}`
                }, { status: 400 });
            }

            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            orderItems.push({
                productId: String(item.productId),
                productName: item.productName,
                productImage: item.productImage,
                price: item.price,
                quantity: item.quantity,
                unit: item.unit,
            });

            // Reduce stock and increase sold count
            await Product.findByIdAndUpdate(item.productId, {
                $inc: {
                    stock: -item.quantity,
                    soldCount: item.quantity
                }
            });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Create order
        const order = await Order.create({
            orderNumber,
            userEmail,
            userName,
            items: orderItems,
            totalAmount,
            status: 'pending',
            shippingAddress: shippingAddress || '',
            notes: notes || '',
        });

        // Clear cart from MongoDB after successful order
        await Cart.updateOne(
            { userEmail },
            { $set: { items: [] } }
        );

        return NextResponse.json({
            success: true,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
            }
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || "Checkout gagal" }, { status: 500 });
    }
}

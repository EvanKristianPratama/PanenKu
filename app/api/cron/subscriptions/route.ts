import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscription } from '@/models/Subscription';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

const FREQUENCY_DAYS: Record<string, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    monthly: 30
};

// POST: Process active subscriptions and create orders
// This should be called by a cron job service (e.g., Vercel Cron, GitHub Actions)
export async function POST(req: Request) {
    try {
        // Optional: Verify cron secret for security
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const now = new Date();

        // Find active subscriptions due for delivery
        const dueSubscriptions = await Subscription.find({
            isActive: true,
            nextDelivery: { $lte: now }
        });

        if (dueSubscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No subscriptions due for processing',
                processed: 0
            });
        }

        const results = {
            processed: 0,
            orders: [] as string[],
            errors: [] as string[]
        };

        for (const sub of dueSubscriptions) {
            try {
                // Check if product still exists and is subscribable
                const product = await Product.findById(sub.productId);
                if (!product || !product.isSubscribable) {
                    // Deactivate subscription if product no longer available
                    await Subscription.findByIdAndUpdate(sub._id, { isActive: false });
                    results.errors.push(`Product ${sub.productName} no longer available`);
                    continue;
                }

                // Check stock
                if (product.stock < sub.quantity) {
                    results.errors.push(`Insufficient stock for ${sub.productName}`);
                    continue;
                }

                // Generate order number
                const orderNumber = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

                // Create order from subscription
                const order = await Order.create({
                    orderNumber,
                    userEmail: sub.userEmail,
                    userName: sub.userName,
                    items: [{
                        productId: String(sub.productId),
                        productName: sub.productName,
                        productImage: sub.productImage,
                        price: sub.price,
                        quantity: sub.quantity,
                        unit: sub.unit,
                        farmer: product.farmer
                    }],
                    totalAmount: sub.price * sub.quantity,
                    status: 'pending',
                    paymentStatus: 'unpaid', // Requires payment confirmation
                    shippingAddress: `${sub.shippingAddress.name}, ${sub.shippingAddress.phone}, ${sub.shippingAddress.address}, ${sub.shippingAddress.city}`,
                    notes: `Auto-order dari langganan ${sub.frequency}`
                });

                // Reduce product stock
                await Product.findByIdAndUpdate(sub.productId, {
                    $inc: { stock: -sub.quantity, soldCount: sub.quantity }
                });

                // Update next delivery date
                const days = FREQUENCY_DAYS[sub.frequency] || 7;
                const nextDelivery = new Date();
                nextDelivery.setDate(nextDelivery.getDate() + days);

                await Subscription.findByIdAndUpdate(sub._id, { nextDelivery });

                results.processed++;
                results.orders.push(order.orderNumber);

            } catch (err: any) {
                results.errors.push(`Failed to process ${sub.productName}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${results.processed} subscriptions`,
            ...results
        });

    } catch (error: any) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Check cron status (for debugging)
export async function GET() {
    try {
        await connectDB();

        const stats = {
            activeSubscriptions: await Subscription.countDocuments({ isActive: true }),
            dueToday: await Subscription.countDocuments({
                isActive: true,
                nextDelivery: { $lte: new Date() }
            })
        };

        return NextResponse.json({
            status: 'Cron endpoint ready',
            ...stats
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

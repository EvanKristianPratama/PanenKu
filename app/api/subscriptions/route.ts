import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Subscription } from '@/models/Subscription';
import { Product } from '@/models/Product';

const FREQUENCY_DAYS: Record<string, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    monthly: 30
};

// GET: Fetch user's subscriptions
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const subscriptions = await Subscription.find({
            userEmail: session.user.email
        }).sort({ createdAt: -1 });

        return NextResponse.json({ subscriptions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create new subscription (status: pending until payment confirmed)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await req.json();
        const { productId, quantity, frequency, shippingAddress, orderId } = body;

        // Validation
        if (!productId || !quantity || !frequency || !shippingAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if product exists and is subscribable
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        if (!product.isSubscribable) {
            return NextResponse.json({ error: 'Product is not available for subscription' }, { status: 400 });
        }

        // Calculate next delivery date
        const days = FREQUENCY_DAYS[frequency] || 7;
        const nextDelivery = new Date();
        nextDelivery.setDate(nextDelivery.getDate() + days);

        const subscription = await Subscription.create({
            userEmail: session.user.email,
            userName: session.user.name || 'User',
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            quantity: Number(quantity),
            price: product.price,
            unit: product.unit,
            frequency,
            nextDelivery,
            status: 'pending', // Will become 'active' after payment confirmed
            orderId: orderId || null,
            shippingAddress
        });

        return NextResponse.json({
            success: true,
            subscription,
            message: 'Langganan akan aktif setelah pembayaran dikonfirmasi'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update subscription (pause/resume, change quantity, activate)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await req.json();
        const { subscriptionId, status, quantity, frequency } = body;

        if (!subscriptionId) {
            return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (quantity) updateData.quantity = Number(quantity);
        if (frequency) updateData.frequency = frequency;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId, userEmail: session.user.email },
            { $set: updateData },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        let message = 'Langganan diperbarui';
        if (status === 'paused') message = 'Langganan dijeda';
        if (status === 'active') message = 'Langganan diaktifkan';

        return NextResponse.json({ success: true, subscription, message });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Cancel subscription
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const subscriptionId = searchParams.get('id');

        if (!subscriptionId) {
            return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
        }

        const result = await Subscription.findOneAndDelete({
            _id: subscriptionId,
            userEmail: session.user.email
        });

        if (!result) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Langganan dibatalkan' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';

// GET: Fetch orders containing farmer's products
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'farmer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const farmer = await User.findOne({ email: session.user?.email });
        if (!farmer) {
            return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
        }

        // Find orders that contain products from this farmer
        // Orders must have payment approved (paid status)
        const orders = await Order.find({
            'items.farmer': farmer.name,
            paymentStatus: 'paid'
        }).sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update order status (processing -> shipped -> delivered)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'farmer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const farmer = await User.findOne({ email: session.user?.email });
        if (!farmer) {
            return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
        }

        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
        }

        // Valid status transitions
        const validStatuses = ['processing', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Verify order belongs to farmer and update
        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                'items.farmer': farmer.name,
                paymentStatus: 'paid' // Only allow update if payment is confirmed
            },
            { $set: { status } },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: 'Order not found or not authorized' }, { status: 404 });
        }

        const statusLabels: Record<string, string> = {
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai'
        };

        return NextResponse.json({
            success: true,
            order,
            message: `Status pesanan diubah ke "${statusLabels[status]}"`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

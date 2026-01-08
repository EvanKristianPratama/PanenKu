
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Order } from '@/models/Order';
import connectDB from '@/lib/mongodb';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { paymentProof } = await request.json();

        if (!paymentProof) {
            return NextResponse.json(
                { error: 'Proof of payment is required' },
                { status: 400 }
            );
        }

        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Verify order belongs to user
        if (order.userEmail !== session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        order.paymentProof = paymentProof;
        order.paymentStatus = 'pending_verification';
        order.updatedAt = new Date();

        await order.save();

        return NextResponse.json({
            message: 'Payment proof uploaded successfully',
            order
        });

    } catch (error) {
        console.error('Payment upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload payment proof' },
            { status: 500 }
        );
    }
}

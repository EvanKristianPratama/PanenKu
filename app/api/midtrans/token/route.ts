import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Order } from '@/models/Order';
import connectDB from '@/lib/mongodb';
// @ts-ignore
import midtransClient from 'midtrans-client';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, grossAmount } = await request.json();

        await connectDB();
        const order = await Order.findOne({ orderNumber: orderId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Reuse existing token if available (Fixes "Order ID Taken" error)
        if (order.snap_token) {
            // Check expiry? For now assuming 24h validity is enough.
            console.log(`Reusing existing Snap Token for ${orderId}`);
            return NextResponse.json({ token: order.snap_token, redirect_url: order.snap_redirect_url });
        }

        // Create Snap instance
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-BWUE1Wzf_X6lBLEWqGHSpvah', // Fallback if env not loaded yet
            clientKey: 'SB-Mid-client-owXNSzDK0hPZ8vRZ'
        });

        // Determine Base URL (prefer env var, fallback to request origin)
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = request.headers.get('host');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

        const parameter = {
            transaction_details: {
                // Determine if we need to append suffix. 
                // Since we reuse tokens, we try sticking to original ID first.
                // If this fails (e.g. token expired but not in DB), we might need retry logic in future.
                order_id: orderId,
                gross_amount: grossAmount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                email: session.user?.email,
                first_name: session.user?.name,
            },
            callbacks: {
                finish: `${baseUrl}/payment/${orderId}`,
                error: `${baseUrl}/payment/${orderId}`,
                pending: `${baseUrl}/payment/${orderId}`
            },
            // Override notification URL to point to our Vercel/Live API
            notification_url: [`${baseUrl}/api/midtrans/notification`]
        };

        const transaction = await snap.createTransaction(parameter);

        // Save unique token for future reuse
        order.snap_token = transaction.token;
        order.snap_redirect_url = transaction.redirect_url;
        await order.save();

        return NextResponse.json({ token: transaction.token, redirect_url: transaction.redirect_url });

    } catch (error: any) {
        console.error('Midtrans Token Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

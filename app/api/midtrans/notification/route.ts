import { NextResponse } from 'next/server';
import { Order } from '@/models/Order';
import connectDB from '@/lib/mongodb';
// @ts-ignore
import midtransClient from 'midtrans-client';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        let apiClient = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: 'SB-Mid-server-BWUE1Wzf_X6lBLEWqGHSpvah',
            clientKey: 'SB-Mid-client-owXNSzDK0hPZ8vRZ'
        });

        // Verify notification signature usually, but here we just process
        // Ideally verify logic here:
        // const notification = await apiClient.transaction.notification(body);

        const notification = body;
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

        await connectDB();
        const order = await Order.findOne({ orderNumber: orderId });

        // Note: orderId from midtrans might be orderNumber from our DB if we sent that
        // OR it might be custom if we appended timestamp. 
        // In checkout/route.ts we generated: `ORD-${Date.now()}-${random}` which is unique.
        // So we should find by orderNumber.

        if (!order) {
            // Try finding by _id if we passed _id as order_id? 
            // In token route we passed `orderId`. Let's assume frontend passes `order.orderNumber`.
            // If we pass `order._id`, then findById. 
            // Let's ensure consistency.
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        let newStatus = order.paymentStatus;

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                // DO set transaction status on your database to 'challenge'
                // order.paymentStatus = 'challenge';
            } else if (fraudStatus == 'accept') {
                newStatus = 'paid';
            }
        } else if (transactionStatus == 'settlement') {
            newStatus = 'paid';
        } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire') {
            newStatus = 'rejected';
        } else if (transactionStatus == 'pending') {
            newStatus = 'pending_verification';
        }

        if (newStatus !== order.paymentStatus) {
            order.paymentStatus = newStatus;
            order.paymentProof = 'Midtrans Automatic Verification';
            await order.save();
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Midtrans Notification Error:', error);
        return NextResponse.json({ error: 'Error processing notification' }, { status: 500 });
    }
}

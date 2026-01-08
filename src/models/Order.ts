import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    unit: string;
    farmer?: string; // Farmer name for order filtering
}

export interface IOrder extends Document {
    orderNumber: string;
    userEmail: string;
    userName: string;
    items: IOrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    paymentStatus: 'unpaid' | 'pending_verification' | 'paid' | 'rejected';
    paymentProof: string;
    snap_token?: string;
    snap_redirect_url?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        farmer: { type: String }, // Farmer name for filtering orders by mitra
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true },
        userEmail: { type: String, required: true },
        userName: { type: String, required: true },
        items: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        shippingAddress: { type: String, default: '' },
        notes: { type: String, default: '' },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'pending_verification', 'paid', 'rejected'],
            default: 'unpaid'
        },
        paymentProof: { type: String, default: '' },
        snap_token: { type: String },
        snap_redirect_url: { type: String }
    },
    { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

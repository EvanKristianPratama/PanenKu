import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISubscription extends Document {
    userEmail: string;
    userName: string;
    productId: Types.ObjectId;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    nextDelivery: Date;
    status: 'pending' | 'active' | 'paused' | 'cancelled';
    orderId?: string; // Links to the initial order for payment tracking
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userEmail: { type: String, required: true, index: true },
        userName: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'biweekly', 'monthly'],
            required: true
        },
        nextDelivery: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'active', 'paused', 'cancelled'],
            default: 'pending'
        },
        orderId: { type: String },
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
SubscriptionSchema.index({ status: 1, nextDelivery: 1 });

export const Subscription: Model<ISubscription> =
    mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);


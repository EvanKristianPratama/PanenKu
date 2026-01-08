import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userEmail: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
    },
    { _id: false }
);

const CartSchema = new Schema<ICart>(
    {
        userEmail: { type: String, required: true, unique: true },
        items: [CartItemSchema],
    },
    { timestamps: true }
);

export const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

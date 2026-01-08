import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    description: string;
    stock: number;
    farmer: string;
    farmerId?: Types.ObjectId;
    location: string;
    soldCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        farmer: { type: String, required: true }, // Keeping for display name
        farmerId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User
        location: { type: String, required: true },
        soldCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

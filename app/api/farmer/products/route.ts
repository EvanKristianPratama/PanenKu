import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

const CATEGORIES = ['Sayuran', 'Buah', 'Beras', 'Bumbu', 'Lainnya'];

// GET: Fetch products by farmer
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'farmer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Find farmer user by email
        const farmer = await User.findOne({ email: session.user?.email });
        if (!farmer) {
            return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
        }

        const products = await Product.find({ farmerId: farmer._id }).sort({ createdAt: -1 });

        return NextResponse.json({
            products,
            categories: CATEGORIES
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add new product
export async function POST(req: NextRequest) {
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
        const { name, price, unit, image, category, description, stock, location, harvestDate, harvestStatus, isSubscribable } = body;

        // Validation
        if (!name || !price || !category) {
            return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
        }

        const newProduct = await Product.create({
            name,
            price: Number(price),
            unit: unit || 'kg',
            image: image || 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400',
            category,
            description: description || `${name} segar dari ${farmer.name}`,
            stock: Number(stock) || 0,
            farmer: farmer.name,
            farmerId: farmer._id,
            location: location || 'Indonesia',
            soldCount: 0,
            harvestDate: harvestDate || null,
            harvestStatus: harvestStatus || 'ready',
            isSubscribable: isSubscribable || false
        });

        return NextResponse.json({
            success: true,
            product: newProduct,
            message: 'Produk berhasil ditambahkan!'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update product
export async function PUT(req: NextRequest) {
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
        const { productId, ...updateData } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        // Only allow update if product belongs to this farmer
        const product = await Product.findOneAndUpdate(
            { _id: productId, farmerId: farmer._id },
            { $set: updateData },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found or not authorized' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product,
            message: 'Produk berhasil diupdate!'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

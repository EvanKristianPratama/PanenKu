import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        // Find the first admin
        const admin = await User.findOne({ role: 'admin' }).select('_id name');

        if (!admin) {
            return NextResponse.json({ error: 'No admin found' }, { status: 404 });
        }

        return NextResponse.json({ id: admin._id, name: admin.name });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

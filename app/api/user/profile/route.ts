import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// GET - Get user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select('-password').lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: (user as any)._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { name, phone, address, city } = await req.json();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true }
        ).select('-password').lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profil berhasil diperbarui',
            user: {
                id: (user as any)._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

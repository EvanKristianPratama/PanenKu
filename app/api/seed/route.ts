import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import bcrypt from 'bcryptjs';

const seedProducts = [
    {
        name: 'Beras Premium',
        price: 12000,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Beras',
        description: 'Beras premium kualitas terbaik dari sawah petani lokal. Pulen, wangi, dan bergizi tinggi.',
        stock: 100,
        // farmer: will be filled dynamically
        location: 'Karawang, Jawa Barat'
    },
    {
        name: 'Sayuran Segar',
        price: 8000,
        unit: 'ikat',
        image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Sayuran',
        description: 'Paket sayuran segar pilihan dari kebun organik.',
        stock: 50,
        location: 'Lembang, Bandung'
    },
    {
        name: 'Buah Tropis',
        price: 15000,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Buah',
        description: 'Buah-buahan tropis segar dan manis.',
        stock: 75,
        location: 'Malang, Jawa Timur'
    },
];

export async function GET() {
    try {
        await connectDB();

        // 1. Clear Data (Optional, comment out in production)
        // await User.deleteMany({});
        // await Product.deleteMany({});

        // 2. Create Users
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Admin
        const admin = await User.findOneAndUpdate(
            { email: 'admin@panenku.com' },
            {
                name: 'Admin PanenKu',
                email: 'admin@panenku.com',
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        // Buyer
        await User.findOneAndUpdate(
            { email: 'pembeli@panenku.com' },
            {
                name: 'Pembeli Setia',
                email: 'pembeli@panenku.com',
                password: hashedPassword,
                role: 'user'
            },
            { upsert: true, new: true }
        );

        // Farmer (Mitra)
        const farmer = await User.findOneAndUpdate(
            { email: 'petani@panenku.com' },
            {
                name: 'Pak Budi Petani',
                email: 'petani@panenku.com',
                password: hashedPassword,
                role: 'farmer'
            },
            { upsert: true, new: true }
        );

        // 3. Create Products linked to Farmer
        for (const prod of seedProducts) {
            await Product.findOneAndUpdate(
                { name: prod.name },
                {
                    ...prod,
                    farmer: farmer.name,
                    farmerId: farmer._id
                },
                { upsert: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            users: {
                admin: 'admin@panenku.com',
                buyer: 'pembeli@panenku.com',
                farmer: 'petani@panenku.com'
            },
            password_all: '123456'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

const seedProducts = [
    {
        name: 'Beras Premium',
        price: 12000,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Beras',
        description: 'Beras premium kualitas terbaik dari sawah petani lokal. Pulen, wangi, dan bergizi tinggi.',
        stock: 100,
        farmer: 'Pak Budi Santoso',
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
        farmer: 'Ibu Siti Aminah',
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
        farmer: 'Pak Ahmad Hidayat',
        location: 'Malang, Jawa Timur'
    },
    {
        name: 'Jagung Manis',
        price: 5000,
        unit: 'buah',
        image: 'https://images.unsplash.com/photo-1700241739138-4ec27c548035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Sayuran',
        description: 'Jagung manis segar hasil panen terbaru.',
        stock: 120,
        farmer: 'Pak Joko Widodo',
        location: 'Kediri, Jawa Timur'
    },
    {
        name: 'Tomat Merah',
        price: 10000,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1683008952458-dc02ac67f382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Sayuran',
        description: 'Tomat merah segar dan matang sempurna.',
        stock: 80,
        farmer: 'Ibu Ratna Sari',
        location: 'Garut, Jawa Barat'
    },
    {
        name: 'Kentang',
        price: 9000,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1574594403367-44e726fa202d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        category: 'Sayuran',
        description: 'Kentang berkualitas tinggi dari dataran tinggi.',
        stock: 90,
        farmer: 'Pak Darmawan',
        location: 'Dieng, Jawa Tengah'
    }
];

const seedUsers = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin'
    },
    {
        name: 'User Demo',
        email: 'user@example.com',
        password: 'user',
        role: 'user'
    }
];

export async function GET() {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Seed users
        await User.insertMany(seedUsers);

        // Seed products
        await Product.insertMany(seedProducts);

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            users: seedUsers.length,
            products: seedProducts.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

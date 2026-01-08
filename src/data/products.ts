import { Product } from '../types';

export let products: Product[] = [
  {
    id: 1,
    name: 'Beras Premium',
    price: 12000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zfGVufDF8fHx8MTc2MTI4Nzc3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Beras',
    description: 'Beras premium kualitas terbaik dari sawah petani lokal. Pulen, wangi, dan bergizi tinggi. Cocok untuk kebutuhan sehari-hari keluarga Indonesia.',
    stock: 100,
    farmer: 'Pak Budi Santoso',
    location: 'Karawang, Jawa Barat'
  },
  {
    id: 2,
    name: 'Sayuran Segar',
    price: 8000,
    unit: 'ikat',
    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYxMjI3OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sayuran',
    description: 'Paket sayuran segar pilihan dari kebun organik. Termasuk kangkung, bayam, dan sawi. Dipanen pagi hari untuk kesegaran maksimal.',
    stock: 50,
    farmer: 'Ibu Siti Aminah',
    location: 'Lembang, Bandung'
  },
  {
    id: 3,
    name: 'Buah Tropis',
    price: 15000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0c3xlbnwxfHx8fDE3NjEyODc3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Buah',
    description: 'Buah-buahan tropis segar dan manis. Pilihan terbaik untuk vitamin dan nutrisi keluarga. Langsung dari kebun ke meja Anda.',
    stock: 75,
    farmer: 'Pak Ahmad Hidayat',
    location: 'Malang, Jawa Timur'
  },
  {
    id: 4,
    name: 'Jagung Manis',
    price: 5000,
    unit: 'buah',
    image: 'https://images.unsplash.com/photo-1700241739138-4ec27c548035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwaGFydmVzdHxlbnwxfHx8fDE3NjEyNDA1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sayuran',
    description: 'Jagung manis segar hasil panen terbaru. Manis, renyah, dan sempurna untuk direbus atau dibuat sup. Kualitas premium dari ladang terpilih.',
    stock: 120,
    farmer: 'Pak Joko Widodo',
    location: 'Kediri, Jawa Timur'
  },
  {
    id: 5,
    name: 'Tomat Merah',
    price: 10000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1683008952458-dc02ac67f382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMGZyZXNofGVufDF8fHx8MTc2MTIwMzYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sayuran',
    description: 'Tomat merah segar dan matang sempurna. Kaya akan vitamin C dan antioksidan. Cocok untuk masakan, sambal, atau jus.',
    stock: 80,
    farmer: 'Ibu Ratna Sari',
    location: 'Garut, Jawa Barat'
  },
  {
    id: 6,
    name: 'Kentang',
    price: 9000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1574594403367-44e726fa202d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG9lcyUyMGhhcnZlc3R8ZW58MXx8fHwxNzYxMjE4OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sayuran',
    description: 'Kentang berkualitas tinggi dari dataran tinggi. Tekstur sempurna untuk digoreng, direbus, atau dijadikan perkedel. Segar dan bebas pestisida.',
    stock: 90,
    farmer: 'Pak Darmawan',
    location: 'Dieng, Jawa Tengah'
  }
];

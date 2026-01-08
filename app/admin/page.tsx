import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, Clock } from "lucide-react";
import { mongoService } from "@/services/mongoService";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

export default async function AdminDashboard() {
    await connectDB();

    // Get real data
    const products = await mongoService.getProducts();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const users = await User.find().lean();

    // Calculate stats
    const totalSales = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Overview statistik toko</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Penjualan</CardTitle>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp {totalSales.toLocaleString('id-ID')}</div>
                        <p className="text-xs text-gray-500 mt-1">Dari {orders.filter(o => o.status !== 'cancelled').length} pesanan</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Pesanan</CardTitle>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <div className="flex gap-2 mt-1">
                            {pendingOrders > 0 && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                    {pendingOrders} menunggu
                                </span>
                            )}
                            {processingOrders > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {processingOrders} diproses
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Produk</CardTitle>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-gray-500 mt-1">Produk aktif</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Pengguna</CardTitle>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-gray-500 mt-1">Pengguna terdaftar</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Pesanan Terbaru</CardTitle>
                        <Link href="/admin/orders" className="text-sm text-green-600 hover:underline">
                            Lihat Semua →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Belum ada pesanan</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order: any) => {
                                    const status = statusConfig[order.status] || statusConfig.pending;
                                    return (
                                        <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{order.orderNumber}</p>
                                                    <p className="text-xs text-gray-500">{order.userName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                                <Badge className={`${status.color} text-xs`}>{status.label}</Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Produk</CardTitle>
                        <Link href="/admin/products" className="text-sm text-green-600 hover:underline">
                            Kelola Produk →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Belum ada produk</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.slice(0, 5).map((product) => (
                                    <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

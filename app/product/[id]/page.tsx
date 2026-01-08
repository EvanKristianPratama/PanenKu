import { mongoService } from "@/services/mongoService";
import { ProductDetail } from "@/components/ProductDetail";
import { Navbar } from "@/components/Navbar";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await mongoService.getProduct(params.id);

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center text-red-500">
                    Produk tidak ditemukan
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <ProductDetail product={product} />
        </div>
    );
}

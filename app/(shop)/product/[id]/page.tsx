import { mongoService } from "@/services/mongoService";
import { ProductDetail } from "@/components/ProductDetail";


export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await mongoService.getProduct(params.id);

    if (!product) {
        return (
            <div className="min-h-screen pt-24">
                <div className="container mx-auto px-4 py-8 text-center text-red-500">
                    Produk tidak ditemukan
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <ProductDetail product={product} />
        </div>
    );
}

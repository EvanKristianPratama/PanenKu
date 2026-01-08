import { Navbar } from "@/components/Navbar";
import { Cart } from "@/components/Cart";

export default function CartPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Cart />
        </div>
    );
}

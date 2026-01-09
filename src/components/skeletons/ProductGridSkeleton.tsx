import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid } from "lucide-react";

export function ProductGridSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                    <div key={i}>
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

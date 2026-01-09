import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function CarouselSkeleton() {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="w-9 h-9 rounded-full" />
                </div>
            </div>

            <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-none w-[280px]">
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

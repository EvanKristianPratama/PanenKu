import { CarouselSkeleton } from "@/components/skeletons/CarouselSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";

export default function Loading() {
    return (
        <div className="bg-gray-50 py-10 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Search Filter Skeleton */}
                <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
                    <Skeleton className="h-12 w-full mb-4 rounded-xl" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                </div>

                {/* Carousel Skeletons */}
                <CarouselSkeleton />
                <CarouselSkeleton />

                {/* Grid Skeleton */}
                <div className="mt-10">
                    <ProductGridSkeleton />
                </div>
            </div>
        </div>
    );
}

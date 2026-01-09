import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Image Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-3xl" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-6">
                    <div>
                        <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>

                    <Skeleton className="h-12 w-1/2" />

                    <div className="space-y-4 py-6 border-y">
                        <div className="flex gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 w-12 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

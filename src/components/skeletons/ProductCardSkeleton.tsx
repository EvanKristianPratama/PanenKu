import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full flex flex-col border-0 shadow-md">
            <div className="aspect-square relative">
                <Skeleton className="h-full w-full" />
            </div>

            <CardHeader className="p-4 pb-2 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                <div className="pt-2 space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}

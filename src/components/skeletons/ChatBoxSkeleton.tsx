import { Skeleton } from "@/components/ui/skeleton";

export function ChatBoxSkeleton({ embedded = false }: { embedded?: boolean }) {
    const containerClass = embedded
        ? "flex flex-col h-full bg-gray-50/50"
        : "fixed bottom-6 right-6 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 z-50 flex flex-col h-[450px] ring-1 ring-black/5";

    return (
        <div className={containerClass}>
            {/* Header Skeleton */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-t-3xl border-b border-gray-100/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex flex-col items-start gap-1">
                    <Skeleton className="h-10 w-3/4 rounded-2xl rounded-tl-sm" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <Skeleton className="h-8 w-1/2 rounded-2xl rounded-tl-sm" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>

            {/* Input Skeleton */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 rounded-b-3xl">
                <div className="flex gap-2">
                    <Skeleton className="h-12 flex-1 rounded-2xl" />
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

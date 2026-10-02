import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true">
      <span className="sr-only">Loading table</span>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function PageSkeleton({ withStats = false }: { withStats?: boolean }) {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {withStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      ) : null}
      <TableSkeleton />
    </div>
  );
}

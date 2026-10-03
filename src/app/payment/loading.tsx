import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full space-y-4" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

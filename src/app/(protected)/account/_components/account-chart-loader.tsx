import { Skeleton } from "@/components/ui/skeleton";

function AccountChartLoader() {
  return (
    <>
      {/* main */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-48 sm:w-64" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        <div className="pb-2 text-right">
          <Skeleton className="h-6 w-24 sm:w-32" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
      </div>

      {/* chart */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-7">
          <Skeleton className="h-4 w-40 rounded" />
          <div className="flex h-9 w-[140px] items-center space-x-2">
            <Skeleton className="h-full w-[80%] rounded" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>

        {/* Overview Section */}
        <div className="p-6 pt-0">
          <div className="mb-6 flex justify-around text-sm">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 text-center">
                <Skeleton className="mx-auto h-4 w-20 rounded" />
                <Skeleton className="mx-auto h-6 w-24 rounded" />
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <Skeleton className="h-[300px] rounded" />
        </div>
      </div>
    </>
  );
}

export { AccountChartLoader };

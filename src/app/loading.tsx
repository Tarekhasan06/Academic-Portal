export default function Loading() {
  return (
    <div className="space-y-9" aria-busy="true" aria-label="Loading the wallet">
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
        <div className="overflow-hidden rounded-[10px] border-t-[6px] border-navy bg-coupon lg:col-span-7">
          <div className="space-y-3 p-5">
            <div className="h-3 w-32 animate-pulse rounded-[2px] bg-hair" />
            <div className="h-6 w-20 animate-pulse rounded-[3px] bg-hair" />
            <div className="h-8 w-4/5 animate-pulse rounded-[2px] bg-hair" />
            <div className="h-12 w-full animate-pulse rounded-[2px] bg-stock" />
          </div>
          <div className="tear" />
          <div className="p-5">
            <div className="h-10 w-28 animate-pulse rounded-[2px] bg-lilac-2" />
          </div>
        </div>
        <div className="min-h-56 animate-pulse rounded-[10px] bg-lilac-2 lg:col-span-5" />
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex h-[68px] overflow-hidden rounded-[8px] bg-coupon">
            <div className="flex-1 space-y-2 p-3">
              <div className="h-4 w-24 animate-pulse rounded-[2px] bg-hair" />
              <div className="h-4 w-1/2 animate-pulse rounded-[2px] bg-stock" />
            </div>
            <div className="perf-v w-[78px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

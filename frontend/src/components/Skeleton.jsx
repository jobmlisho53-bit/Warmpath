export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function CourseCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-44 rounded-none rounded-t-xl" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton className="h-3 w-24 mb-1" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

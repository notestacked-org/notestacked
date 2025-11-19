"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function MemberSkeleton() {
  return (
    <div className="flex items-center justify-between p-2 gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="flex-1 min-w-0 space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    </div>
  )
}

export function RecentNoteSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-4 w-4 flex-shrink-0 rounded" />
      <div className="flex-1 min-w-0 space-y-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2 w-20" />
      </div>
    </div>
  )
}

export function NoteSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

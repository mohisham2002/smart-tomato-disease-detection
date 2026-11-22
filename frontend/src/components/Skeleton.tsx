export function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-stone-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-3 bg-stone-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function UserListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 animate-pulse">
      <div className="space-y-6">
        <div className="h-8 bg-stone-200 rounded w-1/3 mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="h-12 bg-stone-200 rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="h-12 bg-stone-200 rounded-lg" />
        </div>
        <div className="h-12 bg-stone-200 rounded-lg w-32" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-stone-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-stone-200 rounded w-48" />
          <div className="h-4 bg-stone-200 rounded w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-stone-200 rounded w-1/4" />
        <div className="h-12 bg-stone-200 rounded-lg" />
      </div>
    </div>
  );
}

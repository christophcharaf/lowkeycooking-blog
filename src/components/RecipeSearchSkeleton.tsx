export default function RecipeSearchSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-cream-100 dark:bg-gray-800" />
        ))}
      </div>

      {/* Search box */}
      <div className="mb-10 h-14 w-full rounded-2xl bg-cream-100 dark:bg-gray-800" />

      {/* Recipe grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 dark:bg-gray-800">
            <div className="aspect-[4/3] w-full bg-cream-100 dark:bg-gray-700" />
            <div className="p-6">
              <div className="mb-2 h-6 w-3/4 rounded-md bg-cream-100 dark:bg-gray-700" />
              <div className="mb-1 h-4 w-full rounded bg-cream-100 dark:bg-gray-700" />
              <div className="mb-5 h-4 w-2/3 rounded bg-cream-100 dark:bg-gray-700" />
              <div className="flex gap-4 border-t border-cream-200 pt-4 dark:border-gray-700">
                <div className="h-4 w-16 rounded bg-cream-100 dark:bg-gray-700" />
                <div className="h-4 w-16 rounded bg-cream-100 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

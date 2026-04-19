export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-20">
      {/* Hero skeleton */}
      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <div className="h-5 w-32 rounded-full bg-cream-100 dark:bg-gray-800" />
        <div className="h-14 w-3/4 rounded-xl bg-cream-100 dark:bg-gray-800" />
        <div className="h-14 w-1/2 rounded-xl bg-cream-100 dark:bg-gray-800" />
        <div className="h-5 w-2/3 rounded bg-cream-100 dark:bg-gray-800" />
      </div>

      {/* Recipe grid skeleton */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 dark:bg-gray-800"
          >
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

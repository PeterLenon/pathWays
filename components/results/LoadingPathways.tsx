export default function LoadingPathways() {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-24">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-5 w-48 bg-secondary-container/50 rounded-full mb-4 animate-pulse" />
        <div className="h-12 w-2/3 bg-surface-container rounded-xl mb-4 animate-pulse" />
        <div className="h-4 w-1/2 bg-surface-container rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cards skeleton */}
        <div className="lg:col-span-8">
          <div className="h-8 w-56 bg-surface-container rounded-xl mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-xl p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-surface-container rounded-xl" />
                  <div className="h-6 w-24 bg-secondary-container/30 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-surface-container rounded-lg" />
                <div className="h-4 w-1/2 bg-surface-container rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surface-container rounded-full" />
                  <div className="h-3 w-5/6 bg-surface-container rounded-full" />
                  <div className="h-3 w-4/6 bg-surface-container rounded-full" />
                </div>
                <div className="h-10 w-full bg-primary-fixed/50 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-highest rounded-xl p-8 space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-surface-container rounded-lg" />
            <div className="h-28 bg-surface-container-low rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-surface-container rounded-lg" />
              <div className="h-4 w-5/6 bg-surface-container rounded-lg" />
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 space-y-3 animate-pulse">
            <div className="h-5 w-32 bg-surface-container rounded-lg" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-surface-container-low rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container rounded-full">
          <svg
            className="animate-spin w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium text-on-surface-variant">
            Analyzing your career pathways…
          </span>
        </div>
      </div>
    </div>
  );
}

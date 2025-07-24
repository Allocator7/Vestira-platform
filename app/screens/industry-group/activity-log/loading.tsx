export default function IndustryGroupActivityLogLoading() {
  return (
    <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-vestira p-8 border border-gray-100">
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

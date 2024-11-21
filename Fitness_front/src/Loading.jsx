import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-10">


      {/* Content loading skeleton */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero section placeholder */}
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

        {/* Content sections placeholders */}
        <div className="animate-pulse">
          {[1, 2].map((section) => (
            <div key={section} className="mb-8">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-40 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Loading


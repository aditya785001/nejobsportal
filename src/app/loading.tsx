export default function Loading() {
  return (
    <div className="container-main py-20">
      <div className="max-w-3xl mx-auto">
        <div className="h-10 w-full max-w-64 skeleton mb-6"></div>
        <div className="h-6 w-full max-w-96 skeleton mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="h-5 w-32 skeleton mb-3"></div>
              <div className="h-4 w-24 skeleton mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full skeleton"></div>
                <div className="h-4 w-3/4 skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

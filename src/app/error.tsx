"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-main py-20 text-center">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
      <p className="text-gray-600 mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

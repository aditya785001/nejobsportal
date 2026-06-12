import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] transition-colors no-underline"
      >
        Go Home
      </Link>
    </div>
  );
}

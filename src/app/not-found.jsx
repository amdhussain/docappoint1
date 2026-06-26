import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007A87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-6xl font-extrabold text-slateDark mb-2">404</h1>
        <h2 className="text-xl font-bold text-slateDark mb-3">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved. 
          Please check the URL or navigate back to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primaryDark transition-all duration-200 shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

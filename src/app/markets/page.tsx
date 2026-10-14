import Link from 'next/link';
export default function MarketsRedirect() { return <><meta httpEquiv="refresh" content="0;url=/industries" /><main className="min-h-screen flex items-center justify-center px-4"><p>This page has moved to <Link href="/industries" className="text-accent-700 underline">Industries & Applications</Link>.</p></main></>; }

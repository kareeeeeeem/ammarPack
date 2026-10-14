import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import QuoteBuilder from '@/components/QuoteBuilder';

export const metadata: Metadata = { title: 'Request a Packaging Quote', description: 'Build a clear cardboard packaging brief for Ammar Pack. Share dimensions, quantity, printing needs, and delivery city through WhatsApp or email.', alternates: { canonical: '/quote' }, openGraph: { title: 'Request a Packaging Quote', description: 'Build a clear cardboard packaging brief for Ammar Pack. Share dimensions, quantity, printing needs, and delivery city through WhatsApp or email.', url: '/quote' } };

export default function QuotePage() { return <><PageHero title="Shape your packaging brief" subtitle="Answer a few practical questions, review your requirements, then choose WhatsApp or email to contact Ammar Pack." imageSrc="/images/heroes/contact.svg" imageAlt="Illustrated cardboard box" /><section className="py-20 bg-brand-50/50"><div className="max-w-4xl mx-auto px-4 sm:px-6"><QuoteBuilder /></div></section></>; }

import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ProductCatalog from '@/components/ProductCatalog';
import ProductFinder from '@/components/ProductFinder';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Cardboard Packaging Products', description: 'Explore corrugated boxes, shipping cartons, printed packaging, and custom cardboard box concepts from Ammar Pack in Egypt.', alternates: { canonical: '/products' }, openGraph: { title: 'Cardboard Packaging Products', description: 'Explore corrugated boxes, shipping cartons, printed packaging, and custom cardboard box concepts from Ammar Pack in Egypt.', url: '/products' } };

export default function ProductsPage() {
  return <>
    <PageHero title="Packaging for the way you work" subtitle="Explore carton and box formats, then tell us about your product. Every quotation starts with your dimensions, use, and design brief." imageSrc="/images/factory/wrapped-cartons.webp" imageAlt="Wrapped stacks of finished cardboard cartons" />
    <section className="py-24 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl"><span className="text-accent-600 text-xs font-semibold uppercase tracking-[0.2em]">Product concepts</span><h2 className="font-display text-3xl md:text-5xl font-bold text-brand-900 mt-3 mb-4">Made to fit your brief</h2><p className="text-brand-600 leading-relaxed">These are common packaging applications for discussion, not a fixed list of confirmed specifications. Share the product, size, quantity, and artwork requirements for an accurate quotation.</p></div>
      <ProductCatalog />
    </div></section>
    <section id="product-finder" className="py-24 bg-brand-50/50"><div className="max-w-5xl mx-auto px-4 sm:px-6"><ProductFinder /></div></section>
    <section className="py-20 bg-white"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900 mb-4">Have a specific box in mind?</h2><p className="text-brand-600 mb-8">Send a sketch or describe what you need. Our team can discuss an appropriate carton solution.</p><Link href="/quote" className="inline-flex rounded-full px-8 py-4 bg-brand-900 text-white font-semibold">Build a quotation brief</Link></div></section>
  </>;
}

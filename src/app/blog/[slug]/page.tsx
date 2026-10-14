import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { articles } from '@/lib/content';

export function generateStaticParams() { return articles.map(a => ({ slug: a.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata { const a = articles.find(item => item.slug === params.slug); return { title: a?.title || 'Packaging Guide', description: a?.excerpt, alternates: { canonical: `/blog/${params.slug}` }, openGraph: { title: a?.title || 'Packaging Guide', description: a?.excerpt, url: `/blog/${params.slug}` } }; }
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find(a => a.slug === params.slug); if (!article) notFound();
  return <><PageHero title={article.title} subtitle={article.excerpt} imageSrc={article.image} imageAlt={`Illustration for ${article.title}`} /><article className="max-w-3xl mx-auto px-4 py-20"><p className="text-xs font-bold tracking-widest uppercase text-accent-700 mb-8">{article.category} · Packaging guide</p>{article.sections.map(([heading,body])=><section key={heading} className="mb-10"><h2 className="font-display text-2xl font-bold text-brand-900 mb-4">{heading}</h2><p className="text-brand-600 leading-8">{body}</p></section>)}<div className="mt-14 p-8 rounded-2xl bg-brand-50"><h2 className="font-display text-2xl font-bold mb-3">Need a carton for your product?</h2><p className="text-brand-600 mb-5">Share your dimensions and intended use with Ammar Pack.</p><Link href="/contact" className="inline-flex rounded-full px-7 py-3 bg-brand-900 text-white font-semibold">Request a quote</Link></div></article></>;
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import FadeIn from '@/components/FadeIn';
import { ArrowRight } from 'lucide-react';
import { articles } from '@/lib/content';

export const metadata: Metadata = { title: 'Packaging Insights', description: 'Practical guides to corrugated boxes, shipping cartons, dimensions, printing, and product protection.', alternates: { canonical: '/blog' }, openGraph: { title: 'Packaging Insights', description: 'Practical guides to corrugated boxes, shipping cartons, dimensions, printing, and product protection.', url: '/blog' } };
export default function BlogPage() { return <>
  <PageHero title="Packaging insights" subtitle="Clear, practical guides to help you plan a better box and a more useful manufacturing brief." imageSrc="/images/heroes/blog.svg" imageAlt="Illustration of a cardboard packaging concept" />
  <section className="py-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">{articles.map((a,i)=><FadeIn key={a.slug} delay={i*0.06}><Link href={`/blog/${a.slug}`} className="group bg-white rounded-2xl border border-brand-100 overflow-hidden card-hover flex flex-col h-full"><div className="relative h-48 overflow-hidden"><Image src={a.image} alt={`Illustration for ${a.title}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized /></div><div className="p-6 flex flex-col flex-1"><span className="text-accent-600 text-xs font-bold uppercase tracking-widest mb-3">{a.category}</span><h2 className="font-display text-xl font-bold text-brand-900 mb-3">{a.title}</h2><p className="text-sm text-brand-600 leading-relaxed flex-1">{a.excerpt}</p><span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-accent-700">Read guide <ArrowRight className="w-4 h-4" /></span></div></Link></FadeIn>)}</div></section>
</>; }

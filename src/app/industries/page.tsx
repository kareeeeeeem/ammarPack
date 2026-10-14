import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FadeIn from '@/components/FadeIn';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { industries } from '@/lib/content';

export const metadata: Metadata = { title: 'Industries & Applications', description: 'Explore packaging applications for food and beverage, retail, e-commerce, electronics, consumer goods, and industrial products.', alternates: { canonical: '/industries' }, openGraph: { title: 'Industries & Applications', description: 'Explore packaging applications for food and beverage, retail, e-commerce, electronics, consumer goods, and industrial products.', url: '/industries' } };

export default function IndustriesPage() { return <>
  <PageHero title="Industries & applications" subtitle="A carton should make sense for the product inside and the journey ahead. These examples can help you shape a packaging brief." imageSrc="/images/heroes/markets.svg" imageAlt="Illustrated product packaging" />
  <section className="py-24 bg-brand-50/50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow="Where packaging works" headline="Built around your use case" subheadline="Illustrative applications, not a claim of existing customers or sector certifications." /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{industries.map((item,i)=><FadeIn key={item.name} delay={i*0.07}><div className="bg-white rounded-2xl border border-brand-100 p-8 h-full card-hover"><span className="font-display text-4xl font-bold text-accent-500">{item.icon}</span><h2 className="font-display text-xl font-bold text-brand-900 mt-8 mb-3">{item.name}</h2><p className="text-sm text-brand-600 leading-relaxed">{item.description}</p></div></FadeIn>)}</div></div></section>
  <section className="py-24 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12"><div><span className="text-accent-600 uppercase tracking-[0.2em] text-xs font-bold">A thoughtful brief</span><h2 className="font-display text-4xl font-bold text-brand-900 mt-4">What to share with us</h2></div><div className="space-y-4 text-brand-600"><p>Tell us the product dimensions and packed weight, how the carton will be handled, and any desired printing or opening style.</p><p>For industry-specific requirements, please include the relevant standards in your inquiry so they can be discussed before quotation.</p><Link href="/contact" className="inline-flex bg-brand-900 text-white font-semibold rounded-full px-8 py-3.5">Discuss your packaging</Link></div></div></section>
</>; }

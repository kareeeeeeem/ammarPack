import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import FadeIn from '@/components/FadeIn';
import SectionHeader from '@/components/SectionHeader';
import { Ruler, Printer, PackageCheck, MessageSquare } from 'lucide-react';

export const metadata: Metadata = { title: 'About Ammar Pack', description: 'Meet Ammar Pack, a cardboard and box manufacturer in Mit Asem, Banha, Egypt, focused on quality, craftsmanship, and punctuality.', alternates: { canonical: '/about' }, openGraph: { title: 'About Ammar Pack', description: 'Meet Ammar Pack, a cardboard and box manufacturer in Mit Asem, Banha, Egypt, focused on quality, craftsmanship, and punctuality.', url: '/about' } };
const values = [
  { title: 'Attention to the brief', desc: 'Packaging starts with the product, its dimensions, and the job the box has to do.', icon: Ruler },
  { title: 'Printing in focus', desc: 'The factory describes manufacturing and printing as part of its carton and box work.', icon: Printer },
  { title: 'Quality mindset', desc: 'Ammar Pack’s stated philosophy centers on quality, craftsmanship, and timing.', icon: PackageCheck },
  { title: 'Direct conversation', desc: 'Talk through your packaging needs with the team before requesting a quotation.', icon: MessageSquare },
];
export default function AboutPage() { return <>
  <PageHero title="About Ammar Pack" subtitle="An Egyptian carton factory with a simple promise: quality, craftsmanship, and care for delivery dates." imageSrc="/images/factory/factory-line.webp" imageAlt="Cardboard production equipment inside the factory" />
  <section className="py-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-14 items-center"><FadeIn direction="left"><span className="text-accent-600 uppercase tracking-[0.2em] text-xs font-bold">Our factory</span><h2 className="font-display text-4xl md:text-5xl font-bold text-brand-900 mt-4 mb-6">Packaging made with purpose</h2><div className="space-y-4 text-brand-600 leading-relaxed"><p>Ammar Pack is based in Mit Asem, Banha, in Egypt’s Qalyubia Governorate. The factory’s official site describes carton and box manufacturing across a range of sizes, with manufacturing and printing lines.</p><p>Its published vision is to grow into a leading carton factory in Egypt and the Arab region. We approach each inquiry by understanding the product, how the box will be used, and the presentation you need.</p><p className="font-semibold text-brand-900 text-xl">Quality · Craftsmanship · Punctuality</p></div><Link href="/contact" className="inline-flex mt-8 rounded-full bg-brand-900 text-white font-semibold px-8 py-3.5">Talk to our team</Link></FadeIn><FadeIn direction="right"><div className="rounded-2xl overflow-hidden border border-brand-100 bg-brand-50"><Image src="/images/factory/board-equipment.webp" alt="Cardboard production equipment and board rolls in the factory" width={768} height={1024} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-80 object-cover" /><div className="p-5 text-sm text-brand-600">A closer look at equipment and materials on the production floor.</div></div></FadeIn></div></section>
  <section className="pb-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><p className="text-accent-700 text-xs font-bold uppercase tracking-[0.2em] mb-3">Factory gallery</p><h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900 mb-8">A closer look at the work.</h2><div className="grid md:grid-cols-3 gap-5">{[
    { src: '/images/factory/equipment-room.webp', alt: 'Production equipment inside the factory', caption: 'The production floor' },
    { src: '/images/factory/production-equipment.webp', alt: 'Cardboard production equipment in operation', caption: 'Equipment in operation' },
    { src: '/images/factory/carton-folding.webp', alt: 'Cardboard sheets moving through factory equipment', caption: 'Cardboard in production' },
    { src: '/images/factory/wrapped-cartons.webp', alt: 'Wrapped stacks of finished cardboard cartons', caption: 'Cartons prepared for handling' },
    { src: '/images/factory/loading-pallet.webp', alt: 'Wrapped cardboard cartons on a pallet', caption: 'Ready for handling' },
    { src: '/images/factory/dispatch-truck.webp', alt: 'Palletized cardboard cartons loaded onto a delivery truck', caption: 'Cartons ready for dispatch' },
  ].map((photo) => <figure key={photo.src} className="overflow-hidden rounded-2xl border border-brand-100 bg-brand-50"><div className="relative aspect-[4/3]"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div><figcaption className="px-5 py-4 text-sm font-medium text-brand-700">{photo.caption}</figcaption></figure>)}</div></div></section>
  <section className="py-24 bg-brand-50/50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow="Our approach" headline="Details that matter" subheadline="A considered carton begins long before it reaches the packing line." /><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">{values.map((v,i)=><FadeIn key={v.title} delay={i*0.08}><div className="bg-white rounded-2xl p-7 border border-brand-100 h-full card-hover"><v.icon className="w-8 h-8 text-accent-600 mb-6" /><h3 className="font-display text-lg font-bold text-brand-900 mb-2">{v.title}</h3><p className="text-sm text-brand-600 leading-relaxed">{v.desc}</p></div></FadeIn>)}</div></div></section>
</>; }

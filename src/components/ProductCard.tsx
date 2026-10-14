import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface ProductCardProps {
  slug: string; name: string; description: string; features: string[]; applications: string; image: string;
}

export default function ProductCard({ slug, name, description, features, applications, image }: ProductCardProps) {
  return <article className="group bg-white rounded-2xl border border-brand-100 overflow-hidden card-hover flex flex-col h-full">
    <div className="relative h-56 overflow-hidden bg-amber-50"><Image src={image} alt={`Illustrative packaging photo of ${name.toLowerCase()}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized /></div>
    <div className="p-6 flex flex-col flex-1">
      <h2 className="font-display text-xl font-bold text-brand-900 mb-3">{name}</h2>
      <p className="text-sm text-brand-600 leading-relaxed mb-4">{description}</p>
      <ul className="space-y-2 mb-5 text-sm text-brand-600">{features.map(feature => <li key={feature} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-accent-600 shrink-0" />{feature}</li>)}</ul>
      <p className="text-xs text-brand-500 mb-5 mt-auto"><strong className="text-brand-800">Typical applications:</strong> {applications}</p>
      <div className="grid grid-cols-2 gap-2"><Link href={`/products/${slug}`} className="inline-flex items-center justify-center text-sm font-semibold text-brand-900 border border-brand-200 hover:border-accent-600 py-3 rounded-xl transition-all">View details</Link><Link href={`/quote?category=${encodeURIComponent(name)}`} className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white bg-brand-900 hover:bg-brand-800 py-3 rounded-xl transition-all">Get quote <ArrowRight className="w-4 h-4" /></Link></div>
    </div>
  </article>;
}

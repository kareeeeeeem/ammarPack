import Link from 'next/link';
import Logo from './Logo';
import WhatsAppLink from './WhatsAppLink';
import siteConfig from '../../site.config';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const links = [
  ['About', '/about'], ['Packaging products', '/products'], ['Product finder', '/products#product-finder'],
  ['Industries', '/industries'], ['Box dimension guide', '/dimensions'], ['Packaging insights', '/blog'], ['Contact', '/contact'],
];

export default function Footer() {
  return <footer>
    <section className="bg-brand-900 py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 md:items-center md:justify-between"><div><h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Let’s talk about your next box.</h2><p className="text-brand-300">Share your dimensions, use, and quantity to start a quotation.</p></div><Link href="/quote" className="inline-flex gap-2 items-center self-start rounded-full bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 font-bold shrink-0">Build a quote <ArrowRight className="w-4 h-4" /></Link></div></section>
    <div className="bg-brand-50 border-t border-brand-100"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-10"><div className="md:col-span-2"><Logo /><p className="max-w-sm mt-5 text-brand-600 text-sm leading-relaxed">Ammar Pack manufactures cardboard cartons and boxes in Mit Asem, Banha, Egypt.</p><p className="inline-block mt-5 text-brand-800 font-semibold">{siteConfig.tagline}</p><p className="text-xs text-brand-500 mt-5">Wordmark is a temporary design pending an official brand asset.</p></div><div><h3 className="uppercase tracking-widest text-xs font-bold text-brand-900 mb-5">Explore</h3><ul className="space-y-3 text-sm text-brand-600">{links.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-accent-700">{label}</Link></li>)}</ul></div><div><h3 className="uppercase tracking-widest text-xs font-bold text-brand-900 mb-5">Contact</h3><ul className="space-y-4 text-sm text-brand-600"><li className="flex gap-3"><Phone className="w-4 h-4 text-accent-600 shrink-0" /><a href="tel:+201155053159" className="hover:text-accent-700">{siteConfig.phone}</a></li><li className="flex gap-3"><Mail className="w-4 h-4 text-accent-600 shrink-0" /><a href={`mailto:${siteConfig.email}`} className="hover:text-accent-700">{siteConfig.email}</a></li><li className="flex gap-3"><MapPin className="w-4 h-4 text-accent-600 shrink-0" /><span>{siteConfig.location}</span></li><li>{siteConfig.hours}</li><li><WhatsAppLink kind="quote" className="text-accent-700 font-semibold hover:underline">Request quote by WhatsApp</WhatsAppLink></li><li><WhatsAppLink kind="visit" className="text-accent-700 font-semibold hover:underline">Ask about a factory visit</WhatsAppLink></li></ul></div></div><div className="border-t border-brand-200 py-6 text-center text-xs text-brand-500">© {new Date().getFullYear()} Ammar Pack. All rights reserved.</div></div>
  </footer>;
}

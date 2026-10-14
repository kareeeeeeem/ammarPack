'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { products } from '@/lib/content';

const categories = ['All', 'Corrugated cartons', 'Printed & retail', 'Specialist uses'];
function categoryFor(slug: string) {
  if (['corrugated-boxes', 'shipping-cartons'].includes(slug)) return categories[1];
  if (['printed-cartons', 'product-boxes'].includes(slug)) return categories[2];
  return categories[3];
}

export default function ProductCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [compare, setCompare] = useState<string[]>([]);
  const visible = useMemo(() => products.filter(p => (category === 'All' || categoryFor(p.slug) === category) && `${p.name} ${p.short} ${p.description} ${p.applications}`.toLowerCase().includes(search.trim().toLowerCase())), [search, category]);
  const selected = compare.map(slug => products.find(p => p.slug === slug)).filter((item): item is (typeof products)[number] => !!item);
  function toggle(slug: string) { setCompare(current => current.includes(slug) ? current.filter(item => item !== slug) : current.length < 3 ? [...current, slug] : current); }
  return <>
    <div className="bg-white rounded-2xl border border-brand-100 p-5 md:p-7 mb-9 shadow-elevated"><div className="flex flex-col md:flex-row md:items-end gap-5"><div className="flex-1"><label htmlFor="product-search" className="block text-sm font-semibold text-brand-900 mb-2">Search packaging ideas</label><input id="product-search" type="search" className="w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-accent-600" placeholder="Try shipping, printing, or retail" value={search} onChange={e => setSearch(e.target.value)} /></div><div><span className="block text-sm font-semibold text-brand-900 mb-2">Filter by application</span><div className="flex flex-wrap gap-2" role="group" aria-label="Product category filters">{categories.map(item => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`text-xs px-3 py-2.5 rounded-full border font-semibold transition ${category === item ? 'bg-brand-900 text-white border-brand-900' : 'bg-white text-brand-700 border-brand-200 hover:border-accent-600'}`}>{item}</button>)}</div></div></div><p className="text-sm text-brand-500 mt-5" aria-live="polite">Showing {visible.length} of {products.length} packaging concepts. Select up to three to compare.</p></div>
    {visible.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{visible.map(p => <div key={p.slug} className="flex flex-col"><ProductCard {...p} /><label className="mt-3 flex items-center gap-2 text-sm text-brand-700 cursor-pointer"><input type="checkbox" className="accent-amber-700 w-4 h-4" checked={compare.includes(p.slug)} disabled={!compare.includes(p.slug) && compare.length >= 3} onChange={() => toggle(p.slug)} />Compare {p.name}</label></div>)}</div> : <div className="rounded-2xl border border-brand-100 bg-white p-10 text-center"><p className="text-brand-700 font-semibold mb-4">No packaging concepts match that search.</p><button type="button" onClick={() => { setSearch(''); setCategory('All'); }} className="text-accent-700 underline font-semibold">Clear search and filters</button></div>}
    {selected.length > 0 && <section aria-labelledby="compare-heading" className="mt-16 bg-white rounded-2xl border border-brand-100 shadow-elevated p-5 md:p-8"><div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs font-bold uppercase tracking-widest text-accent-700">Side by side</p><h2 id="compare-heading" className="font-display text-2xl md:text-3xl font-bold text-brand-900 mt-2">Compare packaging concepts</h2></div><button type="button" className="text-sm text-accent-700 underline shrink-0" onClick={() => setCompare([])}>Clear comparison</button></div><p className="text-sm text-brand-600 mb-6">These are application differences, not verified strength or material specifications.</p><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead><tr><th className="p-3 bg-brand-50">Compare</th>{selected.map(p => <th key={p.slug} className="p-3 bg-brand-50 font-bold text-brand-900">{p.name}</th>)}</tr></thead><tbody><tr><th className="p-3 border-t border-brand-100">Best discussed for</th>{selected.map(p => <td key={p.slug} className="p-3 border-t border-brand-100 text-brand-600">{p.applications}</td>)}</tr><tr><th className="p-3 border-t border-brand-100">Planning focus</th>{selected.map(p => <td key={p.slug} className="p-3 border-t border-brand-100 text-brand-600">{p.short}</td>)}</tr><tr><th className="p-3 border-t border-brand-100">Next step</th>{selected.map(p => <td key={p.slug} className="p-3 border-t border-brand-100"><Link href={`/quote?category=${encodeURIComponent(p.name)}`} className="text-accent-700 font-semibold underline">Build a quote</Link></td>)}</tr></tbody></table></div></section>}
  </>;
}

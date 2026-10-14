'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Mail } from 'lucide-react';
import { products } from '@/lib/content';
import { emptyQuote, quoteMessage, validateQuote, type QuoteData } from '@/lib/quote';
import { whatsappUrl } from '@/lib/whatsapp';
import siteConfig from '../../site.config';

const steps = ['Packaging', 'Specifications', 'Delivery', 'Review'];
const boxTypes = ['Not sure', 'Regular slotted carton', 'Die-cut box', 'Mailer-style box', 'Other'];
const uses = ['Shipping', 'Retail display', 'Storage', 'Product packaging', 'Other', 'Not sure'];
const printing = ['Not sure', 'No printing', 'One-color printing', 'Multicolor printing'];
const materials = ['Not sure', 'Corrugated cardboard', 'Other cardboard'];

export default function QuoteBuilder() {
  const [data, setData] = useState<QuoteData>(emptyQuote);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const allowed = ['category', 'length', 'width', 'height'] as const;
    const values: Partial<QuoteData> = {};
    allowed.forEach(key => { const value = params.get(key); if (value) values[key] = value.slice(0, 100); });
    setData(current => ({ ...current, ...values }));
  }, []);

  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    setData(current => ({ ...current, [key]: value }));
    setErrors(current => { const next = { ...current }; delete next[key]; return next; });
  }

  function next() {
    const found = validateQuote(data, step);
    setErrors(found);
    if (!Object.keys(found).length) setStep(current => Math.min(current + 1, 3));
  }

  function reviewIsValid() {
    const all = { ...validateQuote(data, 0), ...validateQuote(data, 1), ...validateQuote(data, 2) };
    setErrors(all);
    if (Object.keys(all).length) { setStep(all.category || all.intendedUse ? 0 : all.dimensions || all.quantity ? 1 : 2); return false; }
    return true;
  }

  const field = 'w-full min-w-0 rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 focus:border-accent-600 focus:ring-2 focus:ring-accent-100 outline-none';
  const label = 'block text-sm font-semibold text-brand-800 mb-2';
  const message = quoteMessage(data);
  const whatsapp = whatsappUrl(message);
  const email = `mailto:${siteConfig.email}?subject=${encodeURIComponent('Ammar Pack packaging quotation request')}&body=${encodeURIComponent(message)}`;

  return <div className="bg-white border border-brand-100 shadow-elevated rounded-3xl overflow-hidden">
    <div className="bg-brand-50 border-b border-brand-100 px-6 md:px-10 py-6">
      <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent-700 mb-4">Request a quote · Step {step + 1} of 4</p>
      <ol className="grid grid-cols-4 gap-2" aria-label="Quote progress">{steps.map((name, index) => <li key={name} className="min-w-0"><div className={`h-2 rounded-full mb-2 ${index <= step ? 'bg-accent-600' : 'bg-brand-200'}`} /><span className={`text-[11px] sm:text-xs font-semibold ${index === step ? 'text-brand-900' : 'text-brand-500'}`}>{name}</span></li>)}</ol>
    </div>
    <div className="p-6 md:p-10">
      {step === 0 && <section aria-labelledby="quote-packaging-heading"><h2 id="quote-packaging-heading" className="font-display text-3xl font-bold text-brand-900 mb-2">What are you packaging?</h2><p className="text-brand-600 mb-8">Start with the closest category. You can explain your project in more detail later.</p><div className="grid md:grid-cols-2 gap-5"><div><label htmlFor="quote-category" className={label}>Packaging category *</label><select id="quote-category" className={field} value={data.category} onChange={e => update('category', e.target.value)} aria-invalid={!!errors.category}><option value="">Choose a category</option>{products.map(p => <option key={p.slug}>{p.name}</option>)}<option>Not sure</option></select>{errors.category && <p className="text-rose-700 text-sm mt-2" role="alert">{errors.category}</p>}</div><div><label htmlFor="quote-type" className={label}>Box type</label><select id="quote-type" className={field} value={data.boxType} onChange={e => update('boxType', e.target.value)}>{boxTypes.map(value => <option key={value}>{value}</option>)}</select></div><div className="md:col-span-2"><label htmlFor="quote-use" className={label}>Intended use *</label><select id="quote-use" className={field} value={data.intendedUse} onChange={e => update('intendedUse', e.target.value)} aria-invalid={!!errors.intendedUse}><option value="">Choose intended use</option>{uses.map(value => <option key={value}>{value}</option>)}</select>{errors.intendedUse && <p className="text-rose-700 text-sm mt-2" role="alert">{errors.intendedUse}</p>}</div></div></section>}
      {step === 1 && <section aria-labelledby="quote-spec-heading"><h2 id="quote-spec-heading" className="font-display text-3xl font-bold text-brand-900 mb-2">Size and quantity</h2><p className="text-brand-600 mb-8">Dimensions are optional if you do not know them yet. If you enter them, include all three in centimeters.</p><div className="grid sm:grid-cols-3 gap-5 mb-5">{(['length', 'width', 'height'] as const).map(key => <div key={key}><label className={label} htmlFor={`quote-${key}`}>{key[0].toUpperCase() + key.slice(1)} (cm)</label><input id={`quote-${key}`} className={field} type="number" min="0.1" step="any" inputMode="decimal" placeholder="e.g. 40" value={data[key]} onChange={e => update(key, e.target.value)} /></div>)}</div>{errors.dimensions && <p className="text-rose-700 text-sm mb-5" role="alert">{errors.dimensions}</p>}<div className="grid md:grid-cols-2 gap-5"><div><label htmlFor="quote-quantity" className={label}>Approximate quantity (pieces)</label><input id="quote-quantity" className={field} type="number" min="1" step="1" inputMode="numeric" placeholder="e.g. 1000, or leave blank" value={data.quantity} onChange={e => update('quantity', e.target.value)} />{errors.quantity && <p className="text-rose-700 text-sm mt-2" role="alert">{errors.quantity}</p>}</div><div><label htmlFor="quote-material" className={label}>Material preference</label><select id="quote-material" className={field} value={data.material} onChange={e => update('material', e.target.value)}>{materials.map(value => <option key={value}>{value}</option>)}</select></div></div></section>}
      {step === 2 && <section aria-labelledby="quote-delivery-heading"><h2 id="quote-delivery-heading" className="font-display text-3xl font-bold text-brand-900 mb-2">Print and delivery</h2><p className="text-brand-600 mb-8">Tell us what you know. “Not sure” is fine where details still need discussion.</p><div className="grid md:grid-cols-2 gap-5"><div><label htmlFor="quote-printing" className={label}>Printing requirements</label><select id="quote-printing" className={field} value={data.printing} onChange={e => update('printing', e.target.value)}>{printing.map(value => <option key={value}>{value}</option>)}</select></div><div><label htmlFor="quote-colors" className={label}>Printing colors, if known</label><input id="quote-colors" className={field} placeholder="e.g. black and orange" value={data.colors} maxLength={100} onChange={e => update('colors', e.target.value)} /></div><div className="md:col-span-2"><label htmlFor="quote-city" className={label}>Delivery city *</label><input id="quote-city" className={field} placeholder="e.g. Cairo, or Not sure" value={data.city} maxLength={100} onChange={e => update('city', e.target.value)} aria-invalid={!!errors.city} />{errors.city && <p className="text-rose-700 text-sm mt-2" role="alert">{errors.city}</p>}</div><div className="md:col-span-2"><label htmlFor="quote-notes" className={label}>Additional requirements</label><textarea id="quote-notes" className={field} rows={4} placeholder="Describe your product, packing needs, artwork, or questions." value={data.notes} maxLength={1200} onChange={e => update('notes', e.target.value)} /></div></div></section>}
      {step === 3 && <section aria-labelledby="quote-review-heading"><h2 id="quote-review-heading" className="font-display text-3xl font-bold text-brand-900 mb-2">Review your brief</h2><p className="text-brand-600 mb-7">You will open WhatsApp with this message ready to send. Nothing is sent automatically.</p><div className="bg-brand-50 rounded-2xl p-5 md:p-7 mb-7"><dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">{[['Category',data.category],['Box type',data.boxType],['Use',data.intendedUse],['Dimensions',data.length && data.width && data.height ? `${data.length} × ${data.width} × ${data.height} cm` : 'Not sure'],['Quantity',data.quantity ? `${data.quantity} pieces` : 'Not sure'],['Printing',data.printing],['Colors',data.colors || 'Not sure'],['Material',data.material],['Delivery city',data.city],['Notes',data.notes || 'None']].map(([name,value]) => <div key={name}><dt className="text-brand-500">{name}</dt><dd className="font-semibold text-brand-900 break-words">{value}</dd></div>)}</dl></div><div className="flex flex-wrap gap-3 mb-7">{[0,1,2].map(index => <button type="button" key={index} onClick={() => setStep(index)} className="text-sm font-semibold text-accent-700 underline underline-offset-4">Edit {steps[index].toLowerCase()}</button>)}</div><a href={whatsapp} onClick={e => { if (!reviewIsValid()) e.preventDefault(); }} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-[#128C57] hover:bg-[#0e7549] text-white px-8 py-4 font-bold"><MessageCircle className="w-5 h-5" />Request Quote via WhatsApp</a><a href={email} onClick={e => { if (!reviewIsValid()) e.preventDefault(); }} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-white border border-brand-200 text-brand-900 px-8 py-4 font-semibold sm:ml-3 mt-3 sm:mt-0"><Mail className="w-4 h-4" />Use email instead</a><p className="text-xs text-brand-500 mt-4">Opening WhatsApp or your email app does not submit an order or guarantee a response.</p></section>}
      {step < 3 && <div className="flex items-center justify-between gap-3 mt-10 pt-7 border-t border-brand-100"><button type="button" onClick={() => { setErrors({}); setStep(current => Math.max(current - 1, 0)); }} disabled={step === 0} className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-brand-700 font-semibold disabled:opacity-30"><ArrowLeft className="w-4 h-4" />Back</button><button type="button" onClick={next} className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-semibold hover:bg-brand-800">{step === 2 ? 'Review brief' : 'Continue'} {step === 2 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</button></div>}
    </div>
  </div>;
}

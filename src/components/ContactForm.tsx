'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Mail, Send } from 'lucide-react';
import { products } from '@/lib/content';
import { whatsappUrl } from '@/lib/whatsapp';
import siteConfig from '../../site.config';

const key = siteConfig.web3formsKey;
const empty = { name: '', email: '', phone: '', company: '', product: '', quantity: '', dimensions: '', message: '' };
export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  useEffect(() => { const value = new URLSearchParams(window.location.search).get('product'); if (value) setForm(f => ({ ...f, product: value })); }, []);
  const input = 'w-full px-4 py-3.5 rounded-xl border border-brand-200 bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none transition text-sm text-brand-800 placeholder:text-brand-400';
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!key) {
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent('Ammar Pack packaging inquiry')}&body=${encodeURIComponent(inquiryMessage())}`;
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: key, subject: `[Ammar Pack] Packaging inquiry: ${form.product || 'General'} from ${form.name}`, from_name: 'Ammar Pack Website', ...form }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Submission failed');
      setStatus('sent'); setForm(empty);
    } catch { setStatus('error'); }
  }
  function inquiryMessage() { return `Hello Ammar Pack,\n\nI would like to inquire about cardboard packaging.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nCompany: ${form.company || 'Not provided'}\nProduct: ${form.product || 'Not sure'}\nQuantity: ${form.quantity || 'Not sure'}\nDimensions: ${form.dimensions || 'Not sure'}\nRequirements: ${form.message}\n\nThank you.`; }
  function sendWhatsApp() {
    const formElement = document.getElementById('contact-inquiry-form') as HTMLFormElement | null;
    if (!formElement?.reportValidity()) return;
    window.location.assign(whatsappUrl(inquiryMessage()));
  }
  return <form id="contact-inquiry-form" onSubmit={submit} className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><input className={input} aria-label="Full name" required placeholder="Full name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><input className={input} aria-label="Email address" type="email" required placeholder="Email address *" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><input className={input} aria-label="Phone number" type="tel" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /><input className={input} aria-label="Company name" placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div><select className={input} aria-label="Packaging interest" value={form.product} onChange={e=>setForm({...form,product:e.target.value})}><option value="">Packaging interest</option>{products.map(p=><option key={p.slug}>{p.name}</option>)}<option>Other packaging inquiry</option></select><div className="grid md:grid-cols-2 gap-4"><input className={input} aria-label="Approximate quantity" placeholder="Approximate quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} /><input className={input} aria-label="Dimensions" placeholder="Dimensions, if known" value={form.dimensions} onChange={e=>setForm({...form,dimensions:e.target.value})} /></div><textarea className={input} aria-label="Packaging requirements" rows={5} required placeholder="Tell us what you are packing and any printing or handling needs *" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
    {key ? <>{status==='sent'?<div role="status" className="flex gap-3 bg-accent-50 text-accent-800 p-4 rounded-xl"><CheckCircle className="w-5 h-5 shrink-0" />Your inquiry was submitted. Thank you for contacting Ammar Pack.</div>:<button disabled={status==='sending'} className="w-full flex items-center justify-center gap-2 bg-brand-900 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-800 disabled:opacity-60">{status==='sending'?<><Loader2 className="w-4 h-4 animate-spin" />Sending…</>:<><Send className="w-4 h-4" />Send inquiry</>}</button>}{status==='error'&&<div role="alert" className="flex gap-2 text-rose-700 bg-rose-50 p-4 rounded-xl"><AlertCircle className="w-5 h-5 shrink-0" />Submission failed. Please email info@ammarpack.com directly.</div>}</>:<div role="status" className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm">Online submission is not configured yet. Use these completed details in your email or WhatsApp app instead; nothing is sent automatically.</div>}
    {!key && <div className="grid sm:grid-cols-2 gap-3"><button type="submit" className="flex justify-center items-center gap-2 bg-brand-900 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-800"><Mail className="w-4 h-4" />Open email draft</button><button type="button" onClick={sendWhatsApp} className="flex justify-center items-center gap-2 bg-[#128C57] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0e7549]">Open WhatsApp draft</button></div>}
    <p className="flex items-center gap-2 text-xs text-brand-500"><Mail className="w-4 h-4" />Email directly: <a className="text-accent-700 hover:underline" href="mailto:info@ammarpack.com">info@ammarpack.com</a></p>
  </form>;
}

'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import homeLogo from '@/app/logo.png';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const links = [
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/industries', label: 'Industries' },
  { href: '/dimensions', label: 'Box Guide' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-brand-200/50 transition-shadow duration-300 ${scrolled ? 'shadow-elevated' : ''}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        <Link href="/" className="flex-shrink-0">
          {pathname === '/' ? <Image src={homeLogo} alt="Company logo" width={64} height={64} priority className="h-16 w-16 object-cover object-center" /> : <Logo />}
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-300 ${isActive ? 'text-accent-700 bg-accent-50' : 'text-brand-600 hover:text-brand-900 hover:bg-brand-50'}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/quote"
            className="ml-3 flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 bg-brand-900 text-white hover:bg-brand-800 shadow-sm"
          >
            Get Quote
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2.5 rounded-xl transition-colors text-brand-700 hover:bg-brand-50"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-brand-100 animate-slideDown">
          <div className="px-5 py-4 space-y-1">
            <Link href="/" onClick={() => setOpen(false)} className="block py-2.5 px-4 rounded-xl text-sm font-medium text-brand-700 hover:bg-brand-50">Home</Link>
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent-700 bg-accent-50'
                      : 'text-brand-700 hover:text-brand-900 hover:bg-brand-50'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 mt-3 bg-brand-900 text-white text-sm font-semibold px-5 py-3 rounded-full"
            >
              Get Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

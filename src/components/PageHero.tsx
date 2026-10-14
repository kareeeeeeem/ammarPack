'use client';
import Image from 'next/image';
import FadeIn from './FadeIn';

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export default function PageHero({ title, subtitle, imageSrc, imageAlt }: PageHeroProps) {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        unoptimized
      />
      <div className="hero-overlay" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="inline-block bg-accent-500/20 border border-accent-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-accent-300 text-xs font-medium tracking-wide uppercase">Ammar Pack · Egypt</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05]">{title}</h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-brand-300 max-w-3xl leading-relaxed">{subtitle}</p>
        </FadeIn>
      </div>
    </section>
  );
}

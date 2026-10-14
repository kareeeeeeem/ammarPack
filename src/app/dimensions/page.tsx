import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DimensionAssistant from '@/components/DimensionAssistant';

export const metadata: Metadata = { title: 'Box Dimension Guide', description: 'Visualize length, width, and height for a cardboard box, then transfer the measurements into an Ammar Pack quotation brief.', alternates: { canonical: '/dimensions' }, openGraph: { title: 'Box Dimension Guide', description: 'Visualize length, width, and height for a cardboard box, then transfer the measurements into an Ammar Pack quotation brief.', url: '/dimensions' } };
export default function DimensionsPage() { return <><PageHero title="Get the dimensions right" subtitle="A simple visual guide to describing your box size. Use the measurements directly in your quotation brief." imageSrc="/images/heroes/products.svg" imageAlt="Illustrated cardboard box" /><section className="py-20 bg-brand-50/50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><DimensionAssistant /></div></section></>; }

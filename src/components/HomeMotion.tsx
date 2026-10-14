'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, Layers, Package, PenLine, Printer, Truck } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import styles from '@/app/home.module.css';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 42, clipPath: 'inset(0 0 18% 0)' }} whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease }}>{children}</motion.div>;
}

function BoxArt({ label = false }: { label?: boolean }) {
  return <svg className={styles.boxArt} viewBox="0 0 600 520" role="img" aria-label="Illustration of a folded cardboard box">
    <defs>
      <linearGradient id="box-front" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ddb682"/><stop offset="1" stopColor="#bd8550"/></linearGradient>
      <linearGradient id="box-side" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#b67d49"/><stop offset="1" stopColor="#87552f"/></linearGradient>
      <linearGradient id="box-top" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f2d5aa"/><stop offset="1" stopColor="#d8a671"/></linearGradient>
      <pattern id="box-fiber" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 1h7" stroke="#7e4c28" strokeOpacity=".13" strokeWidth=".7"/></pattern>
      <filter id="box-shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="17"/></filter>
    </defs>
    <ellipse cx="305" cy="465" rx="190" ry="27" fill="#644527" opacity=".19" filter="url(#box-shadow)" />
    <g stroke="#784e2e" strokeWidth="2" strokeLinejoin="round">
      <path d="M110 178 345 216 345 437 110 394Z" fill="url(#box-front)"/>
      <path d="M345 216 490 140 490 356 345 437Z" fill="url(#box-side)"/>
      <path d="M110 178 251 102 490 140 345 216Z" fill="url(#box-top)"/>
      <path d="M110 178 345 216 345 437 110 394Z M345 216 490 140 490 356 345 437Z M110 178 251 102 490 140 345 216Z" fill="url(#box-fiber)" stroke="none"/>
      <path d="M224 119 459 158 425 177 189 139Z" fill="#c49059" opacity=".58" stroke="none"/>
      <path d="M177 124 414 164 414 391" fill="none" stroke="#8e5b31" opacity=".42" strokeWidth="3"/>
      <path d="M110 178 345 216 490 140" fill="none" stroke="#fff0cf" strokeOpacity=".55"/>
    </g>
    {label && <g transform="translate(164 277) skewY(9)"><rect width="140" height="74" rx="3" fill="#f6e8d0" opacity=".88"/><text x="70" y="33" textAnchor="middle" fontSize="18" fontFamily="Georgia, serif" fontWeight="bold" fill="#6b4529">AMMAR</text><text x="70" y="54" textAnchor="middle" fontSize="12" fontFamily="Arial, sans-serif" letterSpacing="5" fill="#8b603a">PACK</text></g>}
  </svg>;
}

export function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 100]);
  const boxY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -55]);
  return <section ref={heroRef} className={styles.hero} data-packy-section="hero" aria-labelledby="hero-title">
    <motion.div className={styles.heroPhoto} style={{ y: imageY }}><Image src="/images/factory/factory-line.webp" alt="" fill priority sizes="100vw" /></motion.div>
    <div className={styles.heroVeil} />
    <div className={styles.heroInner}>
      <div className={styles.heroCopy}>
        <motion.p className={styles.heroKicker} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>Ammar Pack <span>·</span> Banha, Egypt</motion.p>
        <h1 id="hero-title"><span className={styles.line}><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.12, ease }}>A better box</motion.span></span><span className={styles.line}><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.24, ease }}>begins with</motion.span></span><span className={`${styles.line} ${styles.heroAccent}`}><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.36, ease }}>your product.</motion.span></span></h1>
        <motion.p className={styles.heroDescription} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease }}>Ammar Pack manufactures cardboard cartons and boxes in Egypt, with attention to fit, presentation, and the details of your packaging brief.</motion.p>
        <motion.div className={styles.heroActions} initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62, ease }}><Link className={styles.primaryButton} href="/quote">Request a quote <ArrowRight size={18} /></Link><Link className={styles.secondaryButton} href="/products">Explore products <ArrowRight size={18} /></Link></motion.div>
      </div>
      <motion.div className={styles.heroBoxWrap} style={{ y: boxY }}><span className={styles.heroBoxCaption}>Designed around what matters inside.</span></motion.div>
    </div>
    <a className={styles.scrollCue} href="#story-title"><span>Scroll to explore</span><ArrowDown size={17} /></a>
  </section>;
}

const stages = [
  { title: 'The sheet', detail: 'It starts with a blank surface and a purpose.' },
  { title: 'The fold lines', detail: 'Every crease gives the material direction.' },
  { title: 'Taking shape', detail: 'Panels rise into a useful form.' },
  { title: 'The finished box', detail: 'Structure and presentation come together.' },
  { title: 'Ready for your product', detail: 'A packaging idea becomes part of the journey.' },
];

function StoryFrame({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const points = index === 0 ? [0, 0.12, 0.2] : index === 4 ? [0.64, 0.8, 1] : [(index - 0.7) / 5, index / 5, (index + 0.9) / 5];
  const opacity = useTransform(progress, points, index === 0 ? [1, 1, 0] : index === 4 ? [0, 1, 1] : [0, 1, 0]);
  const scale = useTransform(progress, [points[0], points[1]], [0.9, 1]);
  return <motion.div className={styles.storyFrame} style={{ opacity, scale }} aria-hidden="true">
    {index < 2 ? <svg viewBox="0 0 600 520" className={styles.storyDrawing}><defs><pattern id="story-fiber" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 2h8" stroke="#93663c" strokeOpacity=".12" /></pattern></defs><path d="M120 140 455 140 510 212 510 366 455 426 120 426 65 366 65 212Z" fill="#ddb482" stroke="#956238" strokeWidth="3"/><path d="M120 140 455 140 510 212 510 366 455 426 120 426 65 366 65 212Z" fill="url(#story-fiber)"/>{index === 1 && <g stroke="#835633" strokeWidth="3" strokeDasharray="9 9" fill="none"><path d="M120 140v286M455 140v286M65 212h445M65 366h445"/><path d="M120 212h335v154H120z"/></g>}</svg> : index === 2 ? <svg viewBox="0 0 600 520" className={styles.storyDrawing}><path d="M113 304 349 344 490 270 256 228Z" fill="#e7c394" stroke="#885a34" strokeWidth="3"/><path d="M113 304 349 344 349 440 113 399Z" fill="#c58d55" stroke="#885a34" strokeWidth="3"/><path d="M349 344 490 270 490 365 349 440Z" fill="#a56c3d" stroke="#885a34" strokeWidth="3"/><path d="M113 304 96 196 335 236 349 344Z" fill="#e4bd8b" stroke="#885a34" strokeWidth="3"/><path d="M349 344 401 180 521 134 490 270Z" fill="#d2a372" stroke="#885a34" strokeWidth="3"/></svg> : <BoxArt label={index === 4} />}
    {index === 4 && <div className={styles.storyProduct}><Package size={28} strokeWidth={1.5} /> Your product, considered.</div>}
  </motion.div>;
}

export function BoxStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 8%', 'end 92%'] });
  return <div ref={sectionRef} className={styles.storyStage}>
    <ol className="sr-only">{stages.map((stage) => <li key={stage.title}>{stage.title}: {stage.detail}</li>)}</ol>
    <div className={styles.storySticky}><div className={styles.storyVisual}>{stages.map((_, index) => <StoryFrame key={index} index={index} progress={scrollYProgress} />)}</div><div className={styles.storySteps}>{stages.map((stage, index) => <StoryLabel key={stage.title} index={index} title={stage.title} detail={stage.detail} progress={scrollYProgress} />)}</div></div>
  </div>;
}

function StoryLabel({ index, title, detail, progress }: { index: number; title: string; detail: string; progress: MotionValue<number> }) {
  const points = index === 0 ? [0, 0.12, 0.2] : index === 4 ? [0.64, 0.8, 1] : [(index - 0.65) / 5, index / 5, (index + 0.85) / 5];
  const opacity = useTransform(progress, points, index === 0 ? [1, 1, 0] : index === 4 ? [0, 1, 1] : [0, 1, 0]);
  return <motion.div className={styles.storyLabel} style={{ opacity }} aria-hidden="true"><span>0{index + 1} / 05</span><h3>{title}</h3><p>{detail}</p></motion.div>;
}

type Product = { slug: string; name: string; short: string; image: string };

function ProductTile({ product, index }: { product: Product; index: number }) {
  const reduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 160, damping: 25 });
  const smoothY = useSpring(rotateY, { stiffness: 160, damping: 25 });
  return <Reveal delay={index * 0.045}><article className={styles.productTile} onPointerMove={(event) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    rotateX.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -7);
  }} onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }}><motion.div className={styles.productSurface} style={{ rotateX: reduced ? 0 : smoothX, rotateY: reduced ? 0 : smoothY }}><Link href={`/products/${product.slug}`} className={styles.productImage}><Image src={product.image} alt={`Illustrative packaging photo of ${product.name.toLowerCase()}`} fill sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 33vw" /></Link><div className={styles.productInfo}><div><span>0{index + 1} / Packaging</span><h3>{product.name}</h3><p>{product.short}</p></div><Link href={`/quote?category=${encodeURIComponent(product.name)}`} aria-label={`Request a quote for ${product.name}`} className={styles.productCta}><ArrowRight size={21} /></Link></div></motion.div></article></Reveal>;
}

export function ProductShowcase({ products }: { products: Product[] }) {
  return <div className={styles.productGrid}>{products.map((product, index) => <ProductTile key={product.slug} product={product} index={index} />)}</div>;
}

const process = [
  { title: 'Planning & Design', text: 'We begin with your product, dimensions, quantity, and the way the carton will be used.', icon: PenLine },
  { title: 'Material Preparation', text: 'Board and format are discussed against the protection and presentation in your brief.', icon: Layers },
  { title: 'Printing & Production', text: 'Artwork and product information are considered as the carton moves into production.', icon: Printer },
  { title: 'Folding & Finishing', text: 'Flat material becomes a usable box through folding, joining, and finishing.', icon: Package },
  { title: 'Quality Review', text: 'Fit, presentation, and the agreed details are checked before the packaging moves on.', icon: Check },
  { title: 'Packaging Delivery', text: 'Finished cartons are prepared for the delivery plan agreed for your project.', icon: Truck },
];

export function ProcessSteps() {
  return <section className={styles.process} data-packy-section="process" aria-labelledby="process-title"><div className={styles.sectionHeading}><Reveal><p className={styles.eyebrow}>From idea to delivery</p><h2 id="process-title">Considered at every step.</h2></Reveal><Reveal className={styles.packyHeading}><p>A simple view of how a packaging brief can move forward. Your exact specifications are confirmed during quotation.</p></Reveal></div><div className={styles.processGrid}>{process.map((step, index) => <Reveal key={step.title} delay={(index % 3) * 0.09} className={styles.processItem}><span className={styles.processNumber}>0{index + 1}</span><step.icon size={31} strokeWidth={1.4} /><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div><div className={styles.processMedia}><div><p className={styles.eyebrow}>Inside the factory</p><h3>See the work behind the carton.</h3><p>A short look at cardboard moving through equipment at Ammar Pack. Play the clip when you are ready; it does not load or play automatically.</p></div><video controls playsInline preload="none" poster="/images/factory/process-poster.webp" aria-label="Short Ammar Pack factory production video"><source src="/media/factory-process.mp4" type="video/mp4" />Your browser does not support this video.</video></div></section>;
}

export function FinalBox() {
  return <div className={styles.finalBox}><div className={styles.finalHalo} /></div>;
}

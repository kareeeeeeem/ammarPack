'use client';

import { useEffect, useRef, useState } from 'react';
import type { PackyController, PackyReaction, PackyVariant } from './PackyScene';
import styles from './PackyMascot.module.css';

const reactions: PackyReaction[] = ['jump', 'spin', 'shy', 'wave', 'surprise', 'reveal'];
const reactionLines: Record<PackyReaction, string> = {
  jump: 'That idea has some bounce!',
  spin: 'A little spin for good measure.',
  shy: 'Oh! You found me.',
  wave: 'Hello again, packaging friend!',
  surprise: 'Well, box my socks!',
  reveal: 'There’s always more inside.',
  celebrate: 'You’re officially part of the pack! 📦',
};
const sectionLines: Record<PackyVariant, string> = {
  hero: 'Hey there! Welcome to Ammar Pack 👋',
  story: 'Here’s the factory behind the boxes.',
  products: 'Let’s find the right fit for your product.',
  process: 'Come see how a box takes shape.',
  quote: "Let's pack your big idea!",
};

function PackySpeechBubble({ message, visible }: { message: string; visible: boolean }) {
  return <span className={`${styles.speech} ${visible ? styles.speechVisible : ''}`} aria-live="polite">{message}</span>;
}

export function PackyFallback() {
  return <svg className={styles.fallback} viewBox="0 0 360 330" role="img" aria-label="Packy, a friendly cardboard box character">
    <defs><linearGradient id="packy-fallback-front" x2="1" y2="1"><stop stopColor="#e8c18d"/><stop offset="1" stopColor="#c58d54"/></linearGradient><linearGradient id="packy-fallback-side" x2="1" y2="1"><stop stopColor="#b87941"/><stop offset="1" stopColor="#8f592e"/></linearGradient></defs>
    <ellipse cx="182" cy="305" rx="114" ry="15" fill="#745032" opacity=".16"/>
    <path d="M73 156 253 163 299 131 122 124Z" fill="#f0d0a1" stroke="#956339" strokeWidth="3"/>
    <path d="M73 156 253 163 253 277 73 270Z" fill="url(#packy-fallback-front)" stroke="#8e5d34" strokeWidth="3"/>
    <path d="M253 163 299 131 299 245 253 277Z" fill="url(#packy-fallback-side)" stroke="#80512e" strokeWidth="3"/>
    <path d="M73 156 115 54 291 64 253 163Z" fill="#e9c18c" stroke="#956339" strokeWidth="3"/>
    <path d="M73 188 32 166 22 176M299 181l36-29 9 8" fill="none" stroke="#25354a" strokeWidth="11" strokeLinecap="round"/>
    <circle cx="23" cy="176" r="13" fill="#fff7e6"/><circle cx="343" cy="157" r="13" fill="#fff7e6"/>
    <path d="M117 274v20h32M207 275v20h32" fill="none" stroke="#25354a" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
    <ellipse cx="134" cy="190" rx="17" ry="22" fill="#fff9eb"/><ellipse cx="196" cy="191" rx="17" ry="22" fill="#fff9eb"/>
    <circle cx="140" cy="194" r="8" fill="#26354a"/><circle cx="202" cy="194" r="8" fill="#26354a"/>
    <path d="M115 158q18-12 37-2M177 157q18-11 37 2" fill="none" stroke="#26354a" strokeWidth="6" strokeLinecap="round"/>
    <path d="M146 225q22 24 47 0" fill="none" stroke="#26354a" strokeWidth="6" strokeLinecap="round"/>
    <rect x="135" y="240" width="60" height="20" rx="2" fill="#f8e9cc" opacity=".8"/><text x="165" y="254" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="bold" fill="#70452a">AMMAR PACK</text>
  </svg>;
}

export default function PackyMascot({ variant, className = '' }: { variant: PackyVariant; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<PackyController | null>(null);
  const bubbleTimer = useRef<number | null>(null);
  const clickCount = useRef(0);
  const reactionIndex = useRef(-1);
  const [visible, setVisible] = useState(false);
  const [pageActive, setPageActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(variant !== 'hero');
  const [message, setMessage] = useState(sectionLines[variant]);
  const [fallbackReacting, setFallbackReacting] = useState(false);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '160px 0px', threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setPageActive(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (!visible || !pageActive || reduced || failed || !canvasRef.current) {
      setReady(false);
      return;
    }
    const canvas = canvasRef.current;
    let cancelled = false;
    let controller: PackyController | null = null;
    const load = async () => {
      try {
        const { mountPacky } = await import('./PackyScene');
        if (cancelled) return;
        controller = mountPacky(canvas, variant, () => setFailed(true));
        controllerRef.current = controller;
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
      controller?.dispose();
      controllerRef.current = null;
    };
  }, [visible, pageActive, reduced, failed, variant]);

  useEffect(() => {
    if (!ready) return;
    const updateProgress = () => {
      const bounds = hostRef.current?.getBoundingClientRect();
      if (!bounds) return;
      controllerRef.current?.setProgress((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
  }, [ready]);

  useEffect(() => {
    if (variant !== 'hero' || !ready) return;
    const track = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      controllerRef.current?.setPointer((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', track, { passive: true });
    return () => window.removeEventListener('pointermove', track);
  }, [ready, variant]);

  useEffect(() => {
    if (variant !== 'hero' || greetingVisible || !visible) return;
    const timer = window.setTimeout(() => setGreetingVisible(true), ready ? 1050 : 450);
    return () => window.clearTimeout(timer);
  }, [variant, greetingVisible, visible, ready]);

  useEffect(() => {
    if (ready && greetingVisible) controllerRef.current?.speak();
  }, [ready, greetingVisible, message]);

  useEffect(() => () => { if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current); }, []);

  const react = () => {
    clickCount.current += 1;
    reactionIndex.current = (reactionIndex.current + 1) % reactions.length;
    const reaction = clickCount.current === 3 ? 'celebrate' : reactions[reactionIndex.current];
    controllerRef.current?.react(reaction);
    setMessage(reactionLines[reaction]);
    setGreetingVisible(true);
    setFallbackReacting(true);
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => { setMessage(sectionLines[variant]); setFallbackReacting(false); }, reaction === 'celebrate' ? 3200 : 2400);
  };

  return <div ref={hostRef} className={`${styles.mascot} ${styles[variant]} ${className}`} data-packy={variant}>
    <PackySpeechBubble message={message} visible={greetingVisible} />
    <button type="button" className={styles.stageButton} onClick={react} onPointerEnter={(event) => { if (event.pointerType === 'mouse') controllerRef.current?.setHover(true); }} onPointerLeave={(event) => { if (event.pointerType === 'mouse') controllerRef.current?.setHover(false); }} onPointerMove={(event) => {
      if (variant === 'hero' || event.pointerType !== 'mouse') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      controllerRef.current?.setPointer(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
    }} aria-label="Tap Packy the cardboard mascot for a surprise" title="Tap Packy for a surprise">
      <span className={`${styles.fallbackLayer} ${fallbackReacting ? styles.fallbackReacting : ''} ${ready ? styles.hidden : ''}`}><PackyFallback /></span>
      <canvas ref={canvasRef} className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`} aria-hidden="true" />
    </button>
    <span className={styles.hint}>{variant === 'hero' ? 'MEET PACKY · TAP TO PLAY' : 'TAP PACKY'}</span>
  </div>;
}

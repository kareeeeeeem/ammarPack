'use client';

import { useEffect, useRef, useState } from 'react';
import type { PackyController, PackyReaction, PackyTravel, PackyVariant } from './PackyScene';
import { PackyFallback } from './PackyMascot';
import styles from './PackyJourney.module.css';

type Stop = { at: number; x: number; y: number; scene: PackyVariant; motion: PackyTravel['motion']; section?: string };

const lines: Record<PackyVariant, string> = {
  hero: 'Hey there! Welcome to Ammar Pack 👋',
  story: 'Come see how a great box takes shape.',
  products: 'A little surprise for every product!',
  process: 'From an idea to the finished carton.',
  quote: "Let's pack your big idea!",
};
const reactions: PackyReaction[] = ['jump', 'spin', 'shy', 'wave', 'surprise', 'reveal'];
const reactionLines: Record<PackyReaction, string> = {
  jump: 'That idea has some bounce!', spin: 'A little spin for good measure.', shy: 'Oh! You found me.',
  wave: 'Hello again, packaging friend!', surprise: 'Well, box my socks!', reveal: 'There’s always more inside.',
  celebrate: 'You’re officially part of the pack! 📦',
};
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const smooth = (value: number) => { const progress = clamp(value, 0, 1); return progress * progress * (3 - 2 * progress); };

function makeStops(viewportHeight: number, mobile: boolean): Stop[] {
  const section = (name: string) => document.querySelector<HTMLElement>(`[data-packy-section="${name}"]`);
  const bounds = (name: string) => {
    const element = section(name);
    if (!element) return { top: 0, height: viewportHeight };
    const rectangle = element.getBoundingClientRect();
    return { top: rectangle.top + window.scrollY, height: rectangle.height };
  };
  const hero = bounds('hero');
  const story = bounds('story');
  const products = bounds('products');
  const process = bounds('process');
  const quality = bounds('quality');
  const quote = bounds('quote');
  const horizontal = (desktop: number, small: number) => mobile ? small : desktop;
  const vertical = (desktop: number, small: number) => mobile ? small : desktop;
  const stops: Stop[] = [
    { at: 0, x: horizontal(.75, .24), y: vertical(.54, .91), scene: 'hero', motion: 'idle' },
    { at: hero.top + hero.height - viewportHeight * .9, x: horizontal(.82, .22), y: vertical(.6, .9), scene: 'hero', motion: 'run' },
    { at: hero.top + hero.height - viewportHeight * .57, x: 1.14, y: .36, scene: 'hero', motion: 'jump' },
    { at: story.top - viewportHeight * .55, x: -.14, y: vertical(.7, .78), scene: 'story', motion: 'slide' },
    { at: story.top + story.height * .16, x: horizontal(.2, .2), y: vertical(.67, .78), scene: 'story', motion: 'walk' },
    { at: story.top + story.height * .4, x: horizontal(.025, -.12), y: vertical(.62, .77), scene: 'story', motion: 'peek' },
    { at: story.top + story.height * .55, x: horizontal(.31, .26), y: vertical(.73, .78), scene: 'story', motion: 'run' },
    { at: products.top - viewportHeight * .6, x: horizontal(.82, .88), y: vertical(.38, .74), scene: 'products', motion: 'jump' },
    { at: products.top + products.height * .14, x: horizontal(.78, .78), y: vertical(.55, .77), scene: 'products', motion: 'present' },
    { at: products.top + products.height * .42, x: horizontal(.18, .19), y: vertical(.7, .79), scene: 'products', motion: 'jump' },
    { at: products.top + products.height * .76, x: 1.14, y: .8, scene: 'products', motion: 'roll' },
    ...((process.top - viewportHeight * .6) - (products.top + products.height * .76) > 200 ? [{ at: ((products.top + products.height * .76) + (process.top - viewportHeight * .6)) / 2, x: horizontal(.63, .52), y: vertical(.28, .38), scene: 'products' as const, motion: 'fly' as const }] : []),
    { at: process.top - viewportHeight * .6, x: -.14, y: vertical(.7, .77), scene: 'process', motion: 'slide' },
    { at: process.top + process.height * .17, x: horizontal(.19, .2), y: vertical(.67, .78), scene: 'process', motion: 'run' },
    { at: process.top + process.height * .45, x: horizontal(.79, .82), y: vertical(.38, .72), scene: 'process', motion: 'jump' },
    { at: process.top + process.height * .76, x: horizontal(.87, .83), y: vertical(.68, .78), scene: 'process', motion: 'land' },
    { at: quality.top - viewportHeight * .5, x: -.14, y: .7, scene: 'story', motion: 'slide', section: 'quality' },
    { at: quality.top + quality.height * .24, x: horizontal(.22, .19), y: vertical(.66, .78), scene: 'story', motion: 'present', section: 'quality' },
    { at: quality.top + quality.height * .38, x: -.14, y: .8, scene: 'story', motion: 'run', section: 'quality' },
    { at: quote.top - viewportHeight * .4, x: 1.14, y: .77, scene: 'quote', motion: 'run' },
    { at: quote.top + quote.height * .1, x: horizontal(.8, .22), y: vertical(.6, .91), scene: 'quote', motion: 'land' },
    { at: quote.top + quote.height * .52, x: horizontal(.77, .22), y: vertical(.58, .91), scene: 'quote', motion: 'present' },
    { at: quote.top + quote.height - viewportHeight * .35, x: 1.14, y: .78, scene: 'quote', motion: 'walk' },
  ];
  return stops.sort((first, second) => first.at - second.at);
}

export default function PackyJourney() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<PackyController | null>(null);
  const sceneRef = useRef<PackyVariant>('hero');
  const countRef = useRef(0);
  const reactionRef = useRef(-1);
  const bubbleTimerRef = useRef<number | null>(null);
  const bubbleVisibleRef = useRef(false);
  const pausedRef = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState(lines.hero);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [fallbackReacting, setFallbackReacting] = useState(false);

  const showMessage = (line: string, persist = false) => {
    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
    setMessage(line);
    setBubbleVisible(true);
    bubbleVisibleRef.current = true;
    controllerRef.current?.speak();
    if (!persist) bubbleTimerRef.current = window.setTimeout(() => { setBubbleVisible(false); bubbleVisibleRef.current = false; }, 3100);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced || failed || !canvasRef.current) return;
    let cancelled = false;
    let controller: PackyController | null = null;
    void import('./PackyScene').then(({ mountPacky }) => {
      if (cancelled || !canvasRef.current) return;
      controller = mountPacky(canvasRef.current, 'hero', () => setFailed(true));
      controllerRef.current = controller;
      controller.setPaused(document.hidden || pausedRef.current);
      setReady(true);
      if (bubbleVisibleRef.current) controller.speak();
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; controller?.dispose(); controllerRef.current = null; setReady(false); };
  }, [reduced, failed]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let stops: Stop[] = [];
    let frame = 0;
    let previousScroll = window.scrollY;
    let previousTime = performance.now();
    let velocity = 0;
    let direction = 1;
    let turningUntil = 0;
    let idleTimer = 0;
    const measure = () => { stops = makeStops(window.innerHeight, window.matchMedia('(max-width: 700px), (pointer: coarse)').matches); update(); };
    const update = () => {
      frame = 0;
      if (document.hidden || !stops.length) return;
      const scroll = window.scrollY;
      if (reduced) {
        host.style.visibility = scroll > stops[2].at ? 'hidden' : 'visible';
        host.style.transform = `translate3d(${(stops[0].x * window.innerWidth - host.offsetWidth / 2).toFixed(1)}px,${(stops[0].y * window.innerHeight - host.offsetHeight / 2).toFixed(1)}px,0)`;
        return;
      }
      const now = performance.now();
      const delta = scroll - previousScroll;
      const elapsed = Math.max(16, now - previousTime);
      if (Math.abs(delta) > 1) {
        const nextDirection = Math.sign(delta);
        if (nextDirection !== direction && velocity > 650) turningUntil = now + 380;
        direction = nextDirection;
      }
      velocity = velocity * .55 + Math.abs(delta) / elapsed * 1000 * .45;
      previousScroll = scroll;
      previousTime = now;
      let index = 0;
      while (index < stops.length - 2 && scroll > stops[index + 1].at) index += 1;
      const start = stops[index];
      const end = stops[Math.min(index + 1, stops.length - 1)];
      const phase = clamp((scroll - start.at) / Math.max(1, end.at - start.at), 0, 1);
      const eased = smooth(phase);
      const width = host.offsetWidth;
      const height = host.offsetHeight;
      const x = (start.x + (end.x - start.x) * eased) * window.innerWidth - width / 2;
      const y = (start.y + (end.y - start.y) * eased) * window.innerHeight - height / 2;
      host.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      const pastJourney = scroll > end.at && index === stops.length - 2;
      host.style.visibility = pastJourney ? 'hidden' : 'visible';
      if (pastJourney !== pausedRef.current) { pausedRef.current = pastJourney; controllerRef.current?.setPaused(pastJourney); }
      const active = phase > .6 ? end : start;
      const section = document.querySelector<HTMLElement>(`[data-packy-section="${active.section ?? active.scene}"]`);
      const rectangle = section?.getBoundingClientRect();
      const progress = rectangle ? clamp((window.innerHeight * .25 - rectangle.top) / Math.max(1, rectangle.height * .65), 0, 1) : 0;
      const motion = (active.motion === 'walk' || active.motion === 'run') && velocity < 35 ? 'idle' : active.motion === 'walk' && velocity > 1000 ? 'run' : active.motion;
      controllerRef.current?.setTravel({ scene: active.scene, progress, motion, direction, velocity, phase, turning: now < turningUntil });
      if (active.scene !== sceneRef.current) {
        sceneRef.current = active.scene;
        showMessage(lines[active.scene], active.scene === 'quote');
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        velocity = 0;
        update();
        if (turningUntil > performance.now()) idleTimer = window.setTimeout(update, turningUntil - performance.now() + 20);
      }, 130);
    };
    const observer = new ResizeObserver(measure);
    document.querySelectorAll('[data-packy-section]').forEach((section) => observer.observe(section));
    const refresh = () => { measure(); };
    const visibility = () => { controllerRef.current?.setPaused(document.hidden || pausedRef.current); if (!document.hidden) { previousTime = performance.now(); schedule(); } };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', refresh);
    document.addEventListener('visibilitychange', visibility);
    const greeting = window.setTimeout(() => { if (sceneRef.current === 'hero') showMessage(lines.hero); }, 1150);
    return () => {
      window.clearTimeout(greeting);
      window.clearTimeout(idleTimer);
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', refresh);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [reduced]);

  useEffect(() => {
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      controllerRef.current?.setPointer((event.clientX / window.innerWidth - .5) * 2, (event.clientY / window.innerHeight - .5) * 2);
    };
    window.addEventListener('pointermove', pointer, { passive: true });
    return () => window.removeEventListener('pointermove', pointer);
  }, []);

  useEffect(() => () => { if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current); }, []);

  const react = () => {
    countRef.current += 1;
    reactionRef.current = (reactionRef.current + 1) % reactions.length;
    const reaction = countRef.current === 3 ? 'celebrate' : reactions[reactionRef.current];
    controllerRef.current?.react(reaction);
    showMessage(reactionLines[reaction]);
    setFallbackReacting(true);
    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => { setMessage(lines[sceneRef.current]); setBubbleVisible(sceneRef.current === 'quote'); setFallbackReacting(false); }, reaction === 'celebrate' ? 3200 : 2400);
  };

  return <div className={styles.viewport}><div ref={hostRef} className={styles.journey} data-packy="journey">
    <span className={`${styles.speech} ${bubbleVisible ? styles.speechVisible : ''}`} aria-live="polite">{message}</span>
    <button type="button" className={styles.stageButton} onClick={react} onPointerEnter={(event) => { if (event.pointerType === 'mouse') controllerRef.current?.setHover(true); }} onPointerLeave={() => controllerRef.current?.setHover(false)} aria-label="Tap Packy the cardboard mascot for a surprise" title="Tap Packy for a surprise">
      <span className={`${styles.fallbackLayer} ${fallbackReacting ? styles.fallbackReacting : ''} ${ready ? styles.hidden : ''}`}><PackyFallback /></span>
      <canvas ref={canvasRef} className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`} aria-hidden="true" />
    </button>
  </div></div>;
}

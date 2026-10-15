'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpRight, BriefcaseBusiness, Code2, ExternalLink, FileText, Linkedin, Mail, MessageCircle, Smartphone, Sparkles, X } from 'lucide-react';
import styles from './DeveloperSignature.module.css';

const links = {
  linkedin: 'https://lnkd.in/dP4azZxh',
  portfolio: 'https://lnkd.in/gdSFHgSc',
  pdf: 'https://lnkd.in/daKKUbBC',
  app: 'https://lnkd.in/dASVvk4s',
  email: 'mailto:kareememad852@gmail.com',
  whatsapp: 'https://wa.me/201004632660',
};

const skills = ['Flutter', 'Dart', 'Node.js', 'Firebase', 'Supabase', 'REST APIs', 'MongoDB'];
const terminal = [
  'initializing developer_profile...',
  'loading creativity...',
  'meet the developer: Kareem Emad',
  'ready to build something amazing.',
];

function Destination({ href, icon: Icon, children }: { href: string; icon: typeof Code2; children: React.ReactNode }) {
  return <a className={styles.destination} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}><Icon size={18} aria-hidden="true" /><span>{children}</span><ArrowUpRight size={15} aria-hidden="true" /></a>;
}

export default function DeveloperSignature() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (event.key !== 'Tab' || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [open]);

  const restoreFocus = () => trigger.current?.focus();

  return <>
    <button ref={trigger} type="button" className={styles.signature} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
      Crafted with <span aria-label="love" role="img">❤️</span> &amp; Code by <strong>Kareem Emad</strong> <span aria-hidden="true">✨</span>
    </button>
    {mounted && createPortal(<AnimatePresence onExitComplete={restoreFocus}>
      {open && <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.28 }} onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
        <motion.div ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="developer-title" aria-describedby="developer-intro" tabIndex={-1}
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.96, rotateX: 4 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: reduceMotion ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={event => { if (reduceMotion || event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`); }}>
          <div className={styles.ambient} aria-hidden="true" />
          <button ref={closeButton} type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close developer profile"><X size={20} /></button>
          <div className={styles.content}>
            <div className={styles.topline}><span className={styles.status}><span className={styles.statusDot} /> AVAILABLE FOR NEW OPPORTUNITIES</span><span className={styles.edition}>DEVELOPER / 001</span></div>
            <div className={styles.grid}>
              <div className={styles.primary}>
                <div className={styles.monogram} aria-hidden="true"><span>KE<span className={styles.monogramStar}>✳</span></span></div>
                <p className={styles.eyebrow}><Sparkles size={15} /> THE PERSON BEHIND THE PIXELS</p>
                <h2 id="developer-title">Kareem <em>Emad.</em></h2>
                <p className={styles.title}>Senior Flutter Developer <span aria-hidden="true">/</span> Full-Stack Developer</p>
                <p id="developer-intro" className={styles.intro}>Hi, I&apos;m Kareem Emad — a Senior Flutter &amp; Full-Stack Developer passionate about crafting beautiful, high-performance digital experiences. From mobile applications to complete web platforms, I turn ideas into real products.</p>
                <div className={styles.stats} aria-label="Experience"><div><strong>6+</strong><span>years in Flutter</span></div><div><strong>~1</strong><span>year with Node.js</span></div><div><strong>3</strong><span>worlds: Mobile, Web &amp; Backend</span></div></div>
                <div className={styles.skillList} aria-label="Skills">{skills.map((skill, index) => <motion.span key={skill} initial={reduceMotion ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .23 + index * .045 }}>{skill}</motion.span>)}</div>
              </div>
              <div className={styles.aside}>
                <div className={styles.terminal} aria-label="Terminal introduction"><div className={styles.terminalBar}><span className={styles.dots} aria-hidden="true"><i /><i /><i /></span><span>kareem@creative-studio ~ %</span><Code2 size={15} aria-hidden="true" /></div><div className={styles.terminalBody}>{terminal.map((line, index) => <motion.p key={line} initial={reduceMotion ? false : { opacity: 0, width: 0 }} animate={{ opacity: 1, width: '100%' }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : .35 + index * .56, ease: 'linear' }}><span aria-hidden="true">›</span> {line}</motion.p>)}<span className={styles.cursor} aria-hidden="true">_</span></div></div>
                <div className={styles.availability}><BriefcaseBusiness size={18} aria-hidden="true" /><span>Open to <strong>Full-time</strong>, <strong>Remote</strong> &amp; <strong>Contract</strong> opportunities.</span></div>
                <div className={styles.actions}><a className={styles.primaryAction} href={links.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> Let&apos;s Build Something Amazing <ArrowUpRight size={17} /></a><a className={styles.secondaryAction} href={links.portfolio} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} /> Explore My Work <ArrowUpRight size={16} /></a></div>
                <p className={styles.linkHeading}>CONNECT / EXPLORE</p>
                <div className={styles.destinations}><Destination href={links.linkedin} icon={Linkedin}>LinkedIn</Destination><Destination href={links.pdf} icon={ArrowDownToLine}>PDF Resume</Destination><Destination href={links.app} icon={Smartphone}>App Resume</Destination><Destination href={links.email} icon={Mail}>Email</Destination><Destination href={links.whatsapp} icon={MessageCircle}>WhatsApp</Destination><Destination href={links.portfolio} icon={FileText}>Portfolio</Destination></div>
              </div>
            </div>
            <div className={styles.bottomline}><span>DESIGNED &amp; DEVELOPED WITH INTENTION</span><span>© KAREEM EMAD</span></div>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>, document.body)}
  </>;
}

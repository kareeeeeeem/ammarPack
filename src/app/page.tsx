import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PackageCheck } from 'lucide-react';
import WhatsAppLink from '@/components/WhatsAppLink';
import PackyJourney from '@/components/packy/PackyJourney';
import { industries, products } from '@/lib/content';
import { BoxStory, CinematicHero, FinalBox, ProductShowcase, Reveal, ProcessSteps } from '@/components/HomeMotion';
import styles from './home.module.css';

export default function Home() {
  return (
    <><div className={styles.home}>
      <CinematicHero />

      <div className={styles.introStrip} aria-label="Ammar Pack at a glance">
        <div><span>01 / Manufacture</span><strong>Cartons shaped around the product</strong></div>
        <div><span>02 / Print</span><strong>Presentation with purpose</strong></div>
        <div><span>03 / Location</span><strong>Mit Asem · Banha · Egypt</strong></div>
      </div>

      <section className={styles.storyIntro} data-packy-section="story" aria-labelledby="story-title">
        <Reveal className={styles.storyCopy}>
          <p className={styles.eyebrow}>From a sheet to a solution</p>
          <h2 id="story-title">Every great package starts flat.</h2>
          <p>A thoughtful carton takes shape around what matters: the product, the journey, and the moment it arrives. Follow the fold from a simple sheet to a finished box.</p>
          <Link className={styles.textLink} href="/about">Meet Ammar Pack <ArrowRight size={17} /></Link>
        </Reveal>
        <BoxStory />
      </section>

      <section id="products" className={styles.products} data-packy-section="products" aria-labelledby="products-title">
        <div className={styles.sectionHeading}>
          <Reveal><p className={styles.eyebrow}>Built for what is inside</p><h2 id="products-title">A box for every brief.</h2></Reveal>
          <Reveal className={styles.packyHeading}><p>Explore packaging formats, then tell us the dimensions, protection, and presentation your product needs.</p></Reveal>
        </div>
        <ProductShowcase products={products} />
        <Link className={styles.textLink} href="/products">Explore all packaging <ArrowRight size={17} /></Link>
      </section>

      <section className={styles.tools} aria-label="Plan your packaging">
        {[
          ['Find a packaging idea', 'Answer a few questions to narrow down useful box categories.', '/products#product-finder'],
          ['Check box dimensions', 'Visualize length, width, and height before requesting a quote.', '/dimensions'],
          ['Build your quote', 'Turn your specifications into a clear WhatsApp or email inquiry.', '/quote'],
        ].map(([title, description, href], index) => (
          <Reveal key={href} delay={index * 0.08}>
            <Link href={href} className={styles.toolCard}><span>0{index + 1} / Plan</span><h3>{title}</h3><p>{description}</p><span className={styles.toolArrow}><ArrowRight size={20} /></span></Link>
          </Reveal>
        ))}
      </section>

      <ProcessSteps />

      <section className={styles.applications} aria-labelledby="applications-title">
        <div className={styles.sectionHeading}>
          <Reveal><p className={styles.eyebrow}>Made for many applications</p><h2 id="applications-title">The right fit starts with a conversation.</h2></Reveal>
          <Reveal><p>These are starting points for your inquiry. Specifications are confirmed through your brief and quotation.</p></Reveal>
        </div>
        <div className={styles.applicationGrid}>{industries.map((item) => <Link href="/industries" key={item.name}><span>{item.icon}</span><strong>{item.name}</strong><ArrowRight size={17} /></Link>)}</div>
      </section>

      <section className={styles.quality} data-packy-section="quality" aria-labelledby="quality-title">
        <Reveal className={styles.qualityImage}><Image src="/images/factory/factory-operator.webp" alt="A factory team member beside cardboard production equipment" fill sizes="(max-width: 800px) 100vw, 50vw" /><span>Inside Ammar Pack / Production floor</span></Reveal>
        <Reveal className={styles.qualityCopy}><PackageCheck size={35} strokeWidth={1.5} /><p className={styles.eyebrow}>Care in every detail</p><h2 id="quality-title">Quality is in the details.</h2><p>A carton must fit its contents, carry the right information, and work in the real packing process. Ammar Pack’s published vision places quality in manufacturing and printing at the center of the conversation.</p><Link className={styles.textLink} href="/quote">Discuss your project <ArrowRight size={17} /></Link></Reveal>
      </section>

      <section className={styles.finalCta} data-packy-section="quote" aria-labelledby="final-title">
        <div className={styles.finalCopy}><Reveal><p className={styles.eyebrow}>The next box is yours</p><h2 id="final-title">Let’s make the right carton for your next project.</h2><p>Tell us what you are packing and what matters most. We’ll discuss the details and prepare a quotation.</p><div className={styles.finalActions}><Link className={styles.primaryButton} href="/quote">Request a quote <ArrowRight size={18} /></Link><WhatsAppLink kind="consultation" className={styles.secondaryButton}>WhatsApp consultation <ArrowRight size={18} /></WhatsAppLink></div></Reveal></div>
        <FinalBox />
      </section>
    </div><PackyJourney /></>
  );
}

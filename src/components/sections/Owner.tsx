import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { OWNER, BUSINESS } from '@/constants/business';
import { Eyebrow } from '@/components/ui/SplitReveal';

const CREDENTIALS = [
  { value: BUSINESS.yearsOfTrust, suffix: '+', label: 'Years Practicing' },
  { value: 40, suffix: 'K+', label: 'Patients Seen' },
  { value: 2001, suffix: '', label: 'Studio Founded' },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('en-IN')),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display font-bold text-2xl sm:text-3xl text-ivory leading-none">
      {display}
      {suffix}
    </span>
  );
}

/** Letter-by-letter typing reveal for the quote — this is what makes the section feel alive, not static. */
function TypingQuote({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const words = text.split(' ');

  return (
    <p ref={ref} className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-snug text-ivory">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0.08 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: i * 0.045 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/** A slowly rotating wax-seal style mark — replaces the photo with a living brand signature. */
function FounderSeal() {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
      <motion.svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      >
        <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(143,176,196,0.35)" strokeWidth="1" strokeDasharray="1 5" />
        <defs>
          <path id="sealPath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="rgba(143,176,196,0.6)" fontSize="8" letterSpacing="3" fontFamily="var(--font-mono)">
          <textPath href="#sealPath">FOUNDER · EST. 2001 · BAJAJ OPTICS ·</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-[18%] rounded-full glass flex items-center justify-center">
        <span className="font-display font-bold text-xl text-ivory">
          {OWNER.name.split(' ').map((n) => n[0]).join('')}
        </span>
      </div>
    </div>
  );
}

export function Owner() {
  return (
    <section className="relative bg-matte py-14 sm:py-20 px-6 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-mist/8 blur-[140px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <Eyebrow>A Word From The Founder</Eyebrow>

        <div className="mt-6">
          <TypingQuote text={`"${OWNER.quote}"`} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-sm text-ivory/45 leading-relaxed max-w-lg mx-auto"
        >
          {OWNER.bio}
        </motion.p>

        {/* Seal + credentials, side by side */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          <FounderSeal />

          <div className="flex items-center gap-6 sm:gap-8">
            {CREDENTIALS.map((c, i) => (
              <div key={c.label} className={i > 0 ? 'pl-6 sm:pl-8 border-l border-white/10' : ''}>
                <CountUp value={c.value} suffix={c.suffix} />
                <p className="mt-1 text-[0.6rem] text-ivory/40 tracking-wide">{c.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="mt-6 font-display italic text-lg text-ivory/70">{OWNER.name}</p>
        <p className="text-xs text-ivory/35 font-mono tracking-wide">{OWNER.role} · {BUSINESS.city}</p>
      </div>
    </section>
  );
}
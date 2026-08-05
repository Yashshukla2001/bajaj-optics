import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BUSINESS } from '@/constants/business';
import { SplitReveal, Eyebrow } from '@/components/ui/SplitReveal';

const STATS = [
  { value: BUSINESS.yearsOfTrust, suffix: '+', label: 'Years of Trust' },
  { value: 40000, suffix: '+', label: 'Happy Customers' },
  { value: BUSINESS.googleRating, suffix: '★', label: 'Google Rating', decimals: 1 },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="font-display font-bold text-3xl sm:text-4xl text-ivory">
      {display}
      {suffix}
    </span>
  );
}

/** Living portrait medallion — real photo, rotating text ring, badges contained safely within its own bounds. */
function StoryMedallion() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const tiltX = useTransform(sy, [-1, 1], [6, -6]);
  const tiltY = useTransform(sx, [-1, 1], [-8, 8]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full max-w-[22rem] mx-auto aspect-square"
      style={{ perspective: 900 }}
    >
      {/* Rotating text ring */}
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      >
        <defs>
          <path id="ringPath" d="M150,150 m-142,0 a142,142 0 1,1 284,0 a142,142 0 1,1 -284,0" />
        </defs>
        <text fill="rgba(143,176,196,0.6)" fontSize="10.5" letterSpacing="4" fontFamily="var(--font-mono)">
          <textPath href="#ringPath">
            EST. 2001 · {BUSINESS.city.toUpperCase()} · FREE EYE TEST · TRUSTED CARE ·
          </textPath>
        </text>
      </motion.svg>

      {/* Portrait — organic mask, contained fully inside the square wrapper */}
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
        className="absolute inset-[16%]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%' }}
        >
          <img
            src="https://images.unsplash.com/photo-1556306510-31ca015374b0?w=900&q=80&auto=format&fit=crop"
            alt="Eyewear craftsmanship at Bajaj Optics"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte/60 via-transparent to-mist/10" />
          <div className="absolute inset-0 ring-1 ring-inset ring-mist-bright/25" style={{ borderRadius: 'inherit' }} />
        </motion.div>
      </motion.div>

      {/* Stat badges — pinned inside the wrapper's own corners, never spill into neighboring content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{ animation: 'float0 6s ease-in-out infinite' }}
        className="absolute top-2 right-2 glass rounded-2xl px-3.5 py-2 text-center"
      >
        <p className="font-display font-bold text-lg text-ivory leading-none">{BUSINESS.yearsOfTrust}+</p>
        <p className="text-[0.55rem] text-ivory/50 font-mono tracking-wide mt-1">YEARS</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.7 }}
        style={{ animation: 'float1 7s ease-in-out infinite' }}
        className="absolute bottom-2 left-2 glass rounded-2xl px-3.5 py-2 text-center"
      >
        <p className="font-display font-bold text-lg text-ivory leading-none">{BUSINESS.googleRating}★</p>
        <p className="text-[0.55rem] text-ivory/50 font-mono tracking-wide mt-1">GOOGLE</p>
      </motion.div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative bg-matte py-14 sm:py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div className="order-2 lg:order-1">
          <StoryMedallion />
        </div>

        <div className="order-1 lg:order-2">
          <Eyebrow>Our Story</Eyebrow>
          <SplitReveal
            as="h2"
            text="Two decades of clarity, one frame at a time."
            className="font-display font-bold text-4xl sm:text-5xl leading-[1.08] text-ivory"
          />

          {/* Pull-quote instead of a flat paragraph block */}
          <motion.blockquote
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-4 pl-5 border-l-2 border-mist-bright/40 text-ivory/60 leading-relaxed max-w-md"
          >
            What began as a single optometry chair in {BUSINESS.city} has grown into a
            trusted destination for vision care — built on honest diagnosis, considered
            frame craft, and a refusal to rush a fitting.
          </motion.blockquote>

          {/* Stats as a clean divided row, not loose floating numbers */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 flex divide-x divide-white/10"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 first:pl-0 px-5">
                <Counter value={s.value} suffix={s.suffix} decimals={'decimals' in s ? s.decimals : 0} />
                <p className="mt-1.5 text-[0.68rem] text-ivory/45 tracking-wide">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
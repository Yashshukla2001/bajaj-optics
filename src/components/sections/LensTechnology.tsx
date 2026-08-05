import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LENS_TECHNOLOGY } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const AUTO_MS = 3800;

/** Each technology gets its own tiny animated demonstration inside the lens circle. */
function LensDemo({ id }: { id: string }) {
  switch (id) {
    case 'bluecut':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <motion.g key={i}>
              <motion.line
                x1="-10" y1={70 + i * 20} x2="80" y2={70 + i * 20}
                stroke="#8FB0C4" strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, delay: i * 0.25, repeat: Infinity, repeatDelay: 0.8 }}
              />
              <motion.line
                x1="100" y1={70 + i * 20} x2="60" y2={40 + i * 20}
                stroke="#8FB0C4" strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.2, delay: i * 0.25 + 0.5, repeat: Infinity, repeatDelay: 1.2 }}
              />
            </motion.g>
          ))}
        </>
      );
    case 'antiglare':
      return (
        <motion.g
          animate={{ scale: [0.6, 1.3], opacity: [0.9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          style={{ originX: '100px', originY: '100px' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="100" y1="100"
              x2={100 + 40 * Math.cos((i / 8) * Math.PI * 2)}
              y2={100 + 40 * Math.sin((i / 8) * Math.PI * 2)}
              stroke="#F6F3EE" strokeWidth="1.5"
            />
          ))}
        </motion.g>
      );
    case 'uv':
      return (
        <>
          <motion.circle
            cx="100" cy="100" r="88" fill="none" stroke="#8FB0C4" strokeWidth="1.5" strokeDasharray="4 5"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '100px', originY: '100px' }}
          />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <motion.line
                key={i}
                x1={100 + 95 * Math.cos(a)} y1={100 + 95 * Math.sin(a)}
                x2={100 + 68 * Math.cos(a)} y2={100 + 68 * Math.sin(a)}
                stroke="#8FB0C4" strokeWidth="2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}
              />
            );
          })}
        </>
      );
    case 'scratch':
      return (
        <>
          {[{ x1: 60, y1: 70, x2: 110, y2: 90 }, { x1: 80, y1: 120, x2: 140, y2: 100 }].map((s, i) => (
            <motion.line
              key={i}
              {...s}
              stroke="#F6F3EE" strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, repeatDelay: 0.6 }}
            />
          ))}
        </>
      );
    case 'photochromic':
      return (
        <motion.circle
          cx="100" cy="100" r="86"
          fill="#8FB0C4"
          animate={{ opacity: [0.05, 0.42, 0.05] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      );
    case 'progressive':
      return (
        <motion.g animate={{ y: [-30, 30, -30] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
          <line x1="20" y1="70" x2="180" y2="70" stroke="#8FB0C4" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#8FB0C4" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#8FB0C4" strokeWidth="1" strokeDasharray="3 4" />
        </motion.g>
      );
    default:
      return null;
  }
}

export function LensTechnology() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tech = LENS_TECHNOLOGY[active];
  const count = LENS_TECHNOLOGY.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, count]);

return (
    <section id="lens-tech" className="relative bg-matte py-14 sm:py-20 px-6 pb-24 sm:pb-28 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <Eyebrow>Lens Technology</Eyebrow>
        <SplitReveal
          as="h2"
          text="Engineered for how you actually see."
          className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
        />
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center">
        {/* Left — technology selector */}
        <div>
          {LENS_TECHNOLOGY.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setActive(i); setPaused(true); }}
              className="group relative w-full flex items-center gap-4 py-4 border-b border-white/8 text-left"
            >
              <span className={`font-mono text-[0.65rem] transition-colors duration-300 ${i === active ? 'text-mist-bright' : 'text-ivory/25'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`font-display font-bold text-lg sm:text-xl transition-all duration-300 ${i === active ? 'text-ivory translate-x-1' : 'text-ivory/35 group-hover:text-ivory/60'}`}>
                {t.title}
              </span>
              {i === active && (
                <motion.span layoutId="lens-tech-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-mist-bright" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
            </button>
          ))}
        </div>

        {/* Right — the demonstrating lens */}
        <div className="relative aspect-square max-w-xs mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="88" fill="rgba(143,176,196,0.04)" stroke="#8FB0C4" strokeWidth="1" opacity="0.5" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(246,243,238,0.15)" strokeWidth="0.5" />
            <AnimatePresence mode="wait">
              <motion.g key={tech.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} clipPath="url(#lensClip)">
                <LensDemo id={tech.id} />
              </motion.g>
            </AnimatePresence>
            <defs>
              <clipPath id="lensClip">
                <circle cx="100" cy="100" r="86" />
              </clipPath>
            </defs>
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-16 inset-x-0 text-center"
            >
              <p className="text-sm text-ivory/50 max-w-[16rem] mx-auto">{tech.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
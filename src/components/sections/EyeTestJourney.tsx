import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { EYE_TEST_STEPS } from '@/constants/business';
import { Eyebrow } from '@/components/ui/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

const COUNT = EYE_TEST_STEPS.length;
const ACCENTS = ['#8FB0C4', '#C3C9CF', '#8FB0C4', '#F6F3EE', '#8FB0C4'];

/** A distinct animated glyph per step — same restrained SVG-line language used across the site. */
function StepGlyph({ index, color }: { index: number; color: string }) {
  switch (index) {
    case 0: // Book a Slot
      return (
        <>
          <rect x="60" y="40" width="80" height="90" rx="4" fill="none" stroke={color} strokeWidth="1.2" />
          <line x1="60" y1="62" x2="140" y2="62" stroke={color} strokeWidth="1.2" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <motion.circle
                key={`${r}-${c}`}
                cx={78 + c * 22}
                cy={82 + r * 20}
                r="2.5"
                fill={color}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.8, delay: (r * 3 + c) * 0.1, repeat: Infinity }}
              />
            ))
          )}
        </>
      );
    case 1: // Visit Store
      return (
        <>
          <motion.path
            d="M60 130 L60 80 L100 45 L140 80 L140 130 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
          />
          <rect x="90" y="100" width="20" height="30" fill="none" stroke={color} strokeWidth="1" />
        </>
      );
    case 2: // Free Eye Test
      return (
        <>
          <circle cx="100" cy="85" r="40" fill="none" stroke={color} strokeWidth="1.2" />
          <motion.circle
            cx="100" cy="85" r="14"
            fill="none" stroke={color} strokeWidth="1.5"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="100" cy="85" r="4" fill={color} />
        </>
      );
    case 3: // Choose Your Frame
      return (
        <>
          <circle cx="76" cy="85" r="26" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="124" cy="85" r="26" fill="none" stroke={color} strokeWidth="1.2" />
          <line x1="102" y1="85" x2="98" y2="85" stroke={color} strokeWidth="1.2" />
          <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
            <line x1="46" y1="80" x2="34" y2="70" stroke={color} strokeWidth="1" />
            <line x1="154" y1="80" x2="166" y2="70" stroke={color} strokeWidth="1" />
          </motion.g>
        </>
      );
    default: // Ready to Wear
      return (
        <>
          <motion.path
            d="M64 88 L88 112 L138 58"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.2 }}
          />
          <circle cx="100" cy="85" r="46" fill="none" stroke={color} strokeWidth="0.75" opacity="0.4" />
        </>
      );
  }
}

export function EyeTestJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: `+=${COUNT * 100}%`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const i = Math.min(COUNT - 1, Math.floor(self.progress * COUNT));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const step = EYE_TEST_STEPS[active];
  const color = ACCENTS[active % ACCENTS.length];

  return (
    <section id="eye-test" ref={wrapRef} className="relative bg-matte">
  <div className="relative h-[100svh] w-full overflow-hidden flex flex-col items-center px-6 pt-[calc(var(--navbar-height,64px)+2rem)]">
        <div className="text-center z-30 shrink-0">
          <Eyebrow>The Eye Test Journey</Eyebrow>
        </div>

        {/* Progress rail — vertical, right side, desktop only */}
        <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
          {EYE_TEST_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center gap-3 justify-end">
              <span className={`text-[0.6rem] font-mono transition-colors duration-300 ${i === active ? 'text-mist-bright' : 'text-ivory/25'}`}>
                {s.step}
              </span>
              <div className={`h-8 w-px transition-colors duration-300 ${i <= active ? 'bg-mist-bright' : 'bg-white/10'}`} />
            </div>
          ))}
        </div>

        {/* Ambient glow, shifts per step */}
        <motion.div
          animate={{ background: `radial-gradient(40rem 40rem at 50% 55%, ${color}18, transparent 60%)` }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-lg">
          {/* Glyph */}
          <div className="relative w-44 h-36 sm:w-52 sm:h-44 mb-5">
            <svg viewBox="0 0 200 170" className="w-full h-full">
              <AnimatePresence mode="wait">
                <motion.g
                  key={step.step}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.45 }}
                >
                  <StepGlyph index={active} color={color} />
                </motion.g>
              </AnimatePresence>
            </svg>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-xs text-mist-bright mb-3">
                Step {String(active + 1).padStart(2, '0')} of {String(COUNT).padStart(2, '0')}
              </p>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-ivory leading-tight mb-3">
                {step.title}
              </h3>
              <p className="text-ivory/55 text-sm sm:text-base">{step.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile progress dots */}
        <div className="md:hidden absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {EYE_TEST_STEPS.map((s, i) => (
            <span key={s.step} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-mist-bright' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>

        <p className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] font-mono tracking-[0.15em] text-ivory/25 z-30">
          Keep scrolling
        </p>
      </div>
    </section>
  );
}
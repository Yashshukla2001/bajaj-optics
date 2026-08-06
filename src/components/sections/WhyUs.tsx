import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineBanknotes,
  HiOutlineClock,
} from 'react-icons/hi2';
import { WHY_US, BUSINESS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const ICONS = [HiOutlineEye, HiOutlineSparkles, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineBanknotes, HiOutlineClock];
const COUNT = WHY_US.length;
const AUTO_MS = 3500;

export function WhyUs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = WHY_US[active];
  const Icon = ICONS[active % ICONS.length];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % COUNT), AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="relative bg-matte py-14 sm:py-20 px-6 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center mb-6">
        <Eyebrow>Why Bajaj Optics</Eyebrow>
        <SplitReveal
          as="h2"
          text="Built on trust, not templates."
          className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
        />
      </div>

      <div
        className="relative max-w-md mx-auto aspect-square"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slowly rotating orbit ring */}
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          aria-hidden
        >
          <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(143,176,196,0.18)" strokeWidth="1" strokeDasharray="2 8" />
        </motion.svg>

        {/* Progress ring around the center, tied to the active index */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden>
          <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <motion.circle
            cx="200" cy="200" r="120" fill="none" stroke="#8FB0C4" strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - (active + 1) / COUNT) }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Center content — swaps with the active node */}
        <div className="absolute inset-[24%] rounded-full glass flex flex-col items-center justify-center text-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon size={26} className="text-mist-bright mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-ivory leading-snug">{item.title}</h3>
              <p className="mt-2 text-xs text-ivory/50 leading-relaxed max-w-[14rem]">{item.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbiting nodes */}
        {WHY_US.map((w, i) => {
          const angle = (i / COUNT) * 2 * Math.PI - Math.PI / 2;
          const radius = 168;
          const x = 50 + (radius / 4) * Math.cos(angle);
          const y = 50 + (radius / 4) * Math.sin(angle);
          const NodeIcon = ICONS[i % ICONS.length];
          const isActive = i === active;

          return (
            <button
              key={w.title}
              onClick={() => setActive(i)}
              aria-label={w.title}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <motion.span
                animate={{
                  scale: isActive ? 1.25 : 1,
                  backgroundColor: isActive ? 'rgba(143,176,196,0.9)' : 'rgba(246,243,238,0.08)',
                  borderColor: isActive ? 'rgba(143,176,196,0.9)' : 'rgba(246,243,238,0.2)',
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border"
              >
                <NodeIcon size={16} className={isActive ? 'text-matte' : 'text-ivory/60 group-hover:text-ivory'} />
              </motion.span>
              <span
                className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-mono tracking-wide transition-opacity duration-300 ${
                  isActive ? 'opacity-100 text-mist-bright' : 'opacity-0 group-hover:opacity-60 text-ivory'
                }`}
              >
                {w.title}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center mt-5 text-xs text-ivory/30 font-mono tracking-wide">
        {BUSINESS.yearsOfTrust}+ years serving {BUSINESS.city.split(',')[0]} — tap a point to explore
      </p>
    </section>
  );
}
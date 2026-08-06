import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { openWhatsApp } from '@/utils/whatsapp';
import { whatsappMessage } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const FRAMES = [
  {
    id: 'f1',
    name: 'Meridian Round',
    material: 'Titanium · Matte Black',
    image: 'https://images.unsplash.com/photo-1494005826588-25b58776edbc?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Aster Cat-Eye',
    material: 'Acetate · Tortoise',
    image: 'https://images.unsplash.com/photo-1601638058835-43cc7efe2d43?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'f3',
    name: 'Halden Square',
    material: 'Steel · Brushed Silver',
    image: 'https://images.unsplash.com/photo-1589176449149-71f7ea77ec25?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'f4',
    name: 'Voss Aviator',
    material: 'Alloy · Gold',
    image: 'https://images.unsplash.com/photo-1614179818428-220dcc46fe8c?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'f5',
    name: 'Linea Oval',
    material: 'Acetate · Charcoal',
    image: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=900&q=80&auto=format&fit=crop',
  },
] as const;

const AUTO_MS = 3000;

function offsetFrom(active: number, index: number, count: number) {
  let diff = index - active;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

export function FrameShowcase() {
  const [active, setActive] = useState(0);
  const count = FRAMES.length;

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearInterval(id);
  }, [count]);

  function go(dir: 1 | -1) {
    setActive((a) => (a + dir + count) % count);
  }

  return (
    <section
      id="frames"
      className="relative bg-matte py-14 sm:py-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Frame Showcase</Eyebrow>
          <SplitReveal
            as="h2"
            text="A closer look at the collection."
            className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
          />
        </div>
        <p className="text-sm text-ivory/45 max-w-xs font-light">
          Tap a frame to ask about it on WhatsApp.
        </p>
      </div>

      {/* Coverflow stage */}
      <div className="relative h-[26rem] sm:h-[30rem] flex items-center justify-center" style={{ perspective: 1400 }}>
        {FRAMES.map((frame, i) => {
          const offset = offsetFrom(active, i, count);
          const isActive = offset === 0;
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          return (
            <motion.div
              key={frame.id}
              onClick={() => (isActive ? openWhatsApp(whatsappMessage.frame(frame.name)) : setActive(i))}
              animate={{
                x: offset * 220,
                scale: isActive ? 1 : 0.78 - (abs - 1) * 0.08,
                rotateY: offset * -28,
                opacity: abs > 1 ? 0.35 : 1,
                zIndex: 10 - abs,
                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-64 sm:w-80 aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center grayscale-[0.2] contrast-[1.08] brightness-[0.9]"
                style={{ backgroundImage: `url(${frame.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/15 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="absolute bottom-0 inset-x-0 p-6"
                >
                  <p className="font-display font-bold text-2xl text-ivory">{frame.name}</p>
                  <p className="text-xs text-ivory/55 mt-1.5 font-mono tracking-wide">{frame.material}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={() => go(-1)}
          aria-label="Previous frame"
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/70 hover:text-mist-bright transition-colors"
        >
          <HiChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {FRAMES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              aria-label={`Show ${f.name}`}
              className="py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === active ? 'w-7 bg-mist-bright' : 'w-2 bg-ivory/25'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next frame"
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/70 hover:text-mist-bright transition-colors"
        >
          <HiChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
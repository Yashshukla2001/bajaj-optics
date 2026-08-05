import { useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FACE_SHAPES } from '@/constants/business';
import { openWhatsApp } from '@/utils/whatsapp';
import { Eyebrow } from '@/components/ui/SplitReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';

const SHAPE_PHOTOS: Record<string, { url: string; pos: string; filter: string }> = {
  round: {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=80&auto=format&fit=crop',
    pos: 'center 22%',
    filter: 'grayscale(0.1) contrast(1.05)',
  },
  square: {
    url: 'https://images.unsplash.com/photo-1441786485319-5e0f0c092803?w=1400&q=80&auto=format&fit=crop',
    pos: 'center 28%',
    filter: 'grayscale(0.35) contrast(1.1)',
  },
  oval: {
    url: 'https://images.unsplash.com/photo-1563859852284-29b77ae01a7b?w=1400&q=80&auto=format&fit=crop',
    pos: 'center 20%',
    filter: 'contrast(1.05)',
  },
  heart: {
    url: 'https://images.unsplash.com/photo-1500649297466-74794c70acfc?w=1400&q=80&auto=format&fit=crop',
    pos: 'center 24%',
    filter: 'contrast(1.05)',
  },
};
export function FaceShapeGuide() {
  const [active, setActive] = useState<(typeof FACE_SHAPES)[number]['id']>('oval');
  const shape = FACE_SHAPES.find((s) => s.id === active)!;
  const photo = SHAPE_PHOTOS[active];
  const activeIndex = FACE_SHAPES.findIndex((s) => s.id === active);

  const frameRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20 });
  const sy = useSpring(my, { stiffness: 70, damping: 20 });
  const tiltX = useTransform(sy, [-1, 1], [5, -5]);
  const tiltY = useTransform(sx, [-1, 1], [-6, 6]);
  const imgX = useTransform(sx, [-1, 1], [-10, 10]);
  const imgY = useTransform(sy, [-1, 1], [-8, 8]);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section id="face-shapes" className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-matte">
      {/* Giant ghost text of the active shape, behind everything */}
      <AnimatePresence mode="wait">
        <motion.p
          key={shape.id}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-1/2 -translate-y-1/2 font-display font-bold text-[22vw] sm:text-[16vw] leading-none text-ivory/[0.035] whitespace-nowrap select-none pointer-events-none z-0"
        >
          {shape.label.split(' ')[0]}
        </motion.p>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.55fr_1fr] gap-6 lg:gap-10 items-center">
       {/* Left — magazine-index style vertical selector */}
        <div className="pt-20 lg:pt-0">
          <Eyebrow>Find Your Match</Eyebrow>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-ivory leading-tight mt-3 mb-5">
            What's your<br />face shape?
          </h2>

          <div className="border-t border-white/10">
            {FACE_SHAPES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="group relative w-full flex items-center gap-5 py-4 border-b border-white/10 text-left"
              >
                <span
                  className={`font-mono text-[0.65rem] transition-colors duration-300 ${
                    active === s.id ? 'text-mist-bright' : 'text-ivory/25'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`font-display font-bold text-xl sm:text-2xl transition-all duration-300 ${
                    active === s.id ? 'text-ivory translate-x-1' : 'text-ivory/35 group-hover:text-ivory/60'
                  }`}
                >
                  {s.label}
                </span>
                {active === s.id && (
                  <motion.span
                    layoutId="face-index-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-mist-bright"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[0.65rem] font-mono text-ivory/30 tracking-wide">
            {String(activeIndex + 1).padStart(2, '0')} / {String(FACE_SHAPES.length).padStart(2, '0')}
          </p>
        </div>

        {/* Right — large mouse-tilt photo panel with floating result card */}
        <div
          ref={frameRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative h-[62vh] max-h-[560px] hidden sm:block"
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
            className="relative w-full h-full rounded-[2rem] overflow-hidden"
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ x: imgX, y: imgY }}
                className="absolute inset-[-4%] bg-cover"
              >
                <div
                  className="absolute inset-0 bg-cover"
                  style={{ backgroundImage: `url(${photo.url})`, backgroundPosition: photo.pos, filter: photo.filter }}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-matte/70 via-transparent to-matte/10" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
          </motion.div>

          {/* Floating glass result card, layered over the bottom-left of the photo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={shape.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:w-80 glass rounded-2xl p-6"
            >
              <p className="text-sm text-ivory/70 mb-4">{shape.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {shape.recommends.map((r) => (
                  <span key={r} className="rounded-full border border-white/15 px-3 py-1 text-[0.68rem] text-ivory/80 tracking-wide">
                    {r}
                  </span>
                ))}
              </div>
              <MagneticButton
                className="!py-2.5 !px-5 !text-xs"
                onClick={() =>
                  openWhatsApp(`Hi Bajaj Optics, I have a ${shape.label.toLowerCase()} — could you recommend some frames?`)
                }
              >
                Get Recommendations
              </MagneticButton>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile fallback — simple stacked result below the selector, no floating card */}
        <div className="sm:hidden pb-10">
          <AnimatePresence mode="wait">
            <motion.div key={shape.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-sm text-ivory/60 mb-4">{shape.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {shape.recommends.map((r) => (
                  <span key={r} className="rounded-full border border-white/15 px-3 py-1 text-xs text-ivory/80">
                    {r}
                  </span>
                ))}
              </div>
              <MagneticButton
                onClick={() =>
                  openWhatsApp(`Hi Bajaj Optics, I have a ${shape.label.toLowerCase()} — could you recommend some frames?`)
                }
              >
                Get Recommendations
              </MagneticButton>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
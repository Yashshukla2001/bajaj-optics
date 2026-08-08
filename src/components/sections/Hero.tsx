import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BUSINESS, whatsappMessage } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Eyebrow } from '@/components/ui/SplitReveal';
import { useTheme } from '@/hooks/useTheme';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import eyonesHero from '@/assets/images/eyones-hero.jpg';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 'smart-glasses',
    headline: 'Smart Glasses, Now In Store.',
    tag: 'Eyones Smart Sunglasses',
    image: eyonesHero,
    orbX: '30%',
    orbY: '40%',
  },
  {
    id: 'prescription',
    headline: 'Prescription, Perfected.',
    tag: 'Prescription Glasses',
    image: 'https://images.unsplash.com/photo-1556306510-31ca015374b0?w=1800&q=80&auto=format&fit=crop',
    orbX: '28%',
    orbY: '38%',
  },
  {
    id: 'sunglasses',
    headline: 'Shades With Character.',
    tag: 'Sunglasses',
    image: 'https://images.unsplash.com/photo-1523884156331-22cc4f5df98d?w=1800&q=80&auto=format&fit=crop',
    orbX: '70%',
    orbY: '30%',
  },
  {
    id: 'eyetest',
    headline: 'Free Eye Test, Today.',
    tag: 'Eye Consultation',
    image: 'https://images.unsplash.com/photo-1601638058835-43cc7efe2d43?w=1800&q=80&auto=format&fit=crop',
    orbX: '50%',
    orbY: '65%',
  },
  {
    id: 'kids',
    headline: 'Built For Little Explorers.',
    tag: 'Kids Collection',
    image: 'https://images.unsplash.com/photo-1685950925275-281298061f98?w=1800&q=80&auto=format&fit=crop',
    orbX: '32%',
    orbY: '62%',
  },
] as const;
const SLIDE_DURATION = 3000;

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [slide, setSlide] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const bgX = useTransform(sx, [-1, 1], [10, -10]);
  const bgY = useTransform(sy, [-1, 1], [8, -8]);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mx, my]);

  // Auto-advance the carousel, pausing respectfully for reduced-motion users
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  // Hero dissolves into the lens as the user starts scrolling
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        scale: 1.3,
        filter: 'blur(14px)',
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const current = SLIDES[slide];

  return (
    <section
      id="top"
      ref={sectionRef}
      data-theme={theme === 'dark' ? 'dark' : undefined}
      className="relative h-[100svh] w-full overflow-hidden bg-matte flex items-center justify-center"
    >
      {/* Rotating cinematic backdrop */}
      {/* Rotating cinematic backdrop — real eyewear photography, crossfading every 4s */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${current.image})` }}
          >
            <motion.div
              style={{ x: bgX, y: bgY, left: current.orbX, top: current.orbY }}
              className="absolute w-[42rem] h-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mist/10 blur-[130px] mix-blend-screen"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </AnimatePresence>
        {/* Scrim — cinematic dark in dark mode; in light mode a soft cream veil
            that keeps the photo visible and gives the navy/gold text legibility */}
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-matte/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/50 to-matte/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-matte/70 via-transparent to-transparent h-40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-matte/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-matte/80 via-transparent to-matte/25" />
            {/* top scrim so the navbar reads over the photo */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-matte/80 to-transparent" />
            {/* centered glow behind the headline */}
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(58% 44% at 50% 46%, var(--color-matte) 0%, rgba(0,0,0,0) 72%)', opacity: 0.62 }}
            />
          </>
        )}
      </div>

      <div ref={contentRef} className="relative z-10 max-w-3xl px-6 text-center">
        <Eyebrow>{`${BUSINESS.city} · Est. 2007`}</Eyebrow>

        <div className="mt-4 h-[3.4em] sm:h-[2.4em] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-normal text-[9vw] sm:text-[4.2vw] lg:text-[3.4rem] leading-[1.1] tracking-tight text-gradient-mist"
            >
              {current.headline}
            </motion.h1>
          </AnimatePresence>
        </div>

        <p className="mt-4 text-sm text-ivory/50 font-light tracking-wide">
          {BUSINESS.subtitle}
        </p>

        {/* Slide indicators — also act as manual controls */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSlide(i)}
              aria-label={`Show ${s.tag}`}
              className="group py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === slide ? 'w-8 bg-mist-bright' : 'w-3 bg-ivory/25 group-hover:bg-ivory/45'
                }`}
              />
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href={buildWhatsAppLink(whatsappMessage.eyeTest)} icon={<HiOutlineCalendar size={17} />}>
            Book Eye Test
          </MagneticButton>
          <MagneticButton
            variant="outline"
            href={buildWhatsAppLink(whatsappMessage.general)}
            icon={<FaWhatsapp size={16} />}
          >
            WhatsApp Now
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40"
      >
        <span className="eyebrow !text-[0.6rem]">Scroll to Enter</span>
        <span className="w-px h-10 bg-gradient-to-b from-ivory/50 to-transparent" />
      </motion.div>
    </section>
  );
}


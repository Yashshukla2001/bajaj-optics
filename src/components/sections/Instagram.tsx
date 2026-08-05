import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';
import { BUSINESS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const POSTS = [
  { id: 'p1', image: 'https://images.unsplash.com/photo-1556306510-31ca015374b0?w=700&q=80&auto=format&fit=crop', live: false },
  { id: 'p2', image: 'https://images.unsplash.com/photo-1523884156331-22cc4f5df98d?w=700&q=80&auto=format&fit=crop', live: false },
  { id: 'p3', image: 'https://images.unsplash.com/photo-1685950925275-281298061f98?w=700&q=80&auto=format&fit=crop', live: true },
  { id: 'p4', image: 'https://images.unsplash.com/photo-1573569986767-6c832cc6868c?w=700&q=80&auto=format&fit=crop', live: false },
  { id: 'p5', image: 'https://images.unsplash.com/photo-1746329545447-1312bd2f01ca?w=700&q=80&auto=format&fit=crop', live: false },
  { id: 'p6', image: 'https://images.unsplash.com/photo-1601638058835-43cc7efe2d43?w=700&q=80&auto=format&fit=crop', live: false },
];

export function Instagram() {
  const loop = [...POSTS, ...POSTS];

return (
    <section className="relative bg-matte py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Follow Along</Eyebrow>
          <SplitReveal
            as="h2"
            text="Life inside the studio."
            className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
          />
        </div>
      </div>

      {/* Continuously drifting photo strip */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-matte to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-matte to-transparent z-20 pointer-events-none" />

        <div
          className="flex gap-4 w-max hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 38s linear infinite' }}
        >
          {loop.map((post, i) => (
            <div
              key={`${post.id}-${i}`}
              className="group relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shrink-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${post.image})` }}
              />
              <div className="absolute inset-0 bg-matte/0 group-hover:bg-matte/40 transition-colors duration-500 flex items-center justify-center">
                <FaInstagram
                  size={22}
                  className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              {post.live && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 glass rounded-full px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-mist-bright opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mist-bright" />
                  </span>
                  <span className="text-[0.55rem] font-mono text-ivory/80 tracking-wide">NEW</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating follow CTA, overlapping the strip's bottom edge */}
        <motion.a
          href={BUSINESS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          className="relative z-20 mx-auto mt-5 flex items-center gap-3 w-fit glass rounded-full pl-4 pr-5 py-2.5"
        >
          <FaInstagram size={18} className="text-mist-bright" />
          <span className="text-sm text-ivory">{BUSINESS.instagramHandle}</span>
          <span className="w-px h-4 bg-white/15" />
          <span className="text-xs text-ivory/50">Follow</span>
        </motion.a>
      </div>
    </section>
  );
}
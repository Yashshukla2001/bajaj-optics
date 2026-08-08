import { useRef, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '@/constants/business';
import { isCollectionCategory } from '@/data/products';
import { openWhatsApp } from '@/utils/whatsapp';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { HiArrowUpRight } from 'react-icons/hi2';

/** A homepage category tile — opens that category's collection experience. */
function CategoryCard({ cat, index }: { cat: (typeof PRODUCT_CATEGORIES)[number]; index: number }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const hasCollection = isCollectionCategory(cat.id);

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
    setImgOffset({ x: px * -14, y: py * -14 });
  }
  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setImgOffset({ x: 0, y: 0 });
    setHovered(false);
  }

  function handleClick() {
    if (hasCollection) navigate(`/collections/${cat.id}`);
    else openWhatsApp(`Hi Bajaj Optics, I'm interested in your ${cat.title} collection.`);
  }

  return (
    <motion.button
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 40, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative text-left aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 p-7 flex flex-col justify-end transition-[border-color] duration-300 hover:border-mist-bright/40"
    >
      {/* Photo — parallax shift on mouse move, slow idle breathing zoom always running */}
      <motion.div
        animate={{ scale: hovered ? 1.16 : [1.04, 1.09, 1.04] }}
        transition={
          hovered
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { duration: 9 + index, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ x: imgOffset.x, y: imgOffset.y }}
        className="absolute inset-[-6%] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cat.image})` }} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/35 to-matte/5" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_30%,rgba(143,176,196,0.2),transparent_60%)]" />

      {/* Number badge — small live detail */}
      <span className="absolute top-6 left-7 font-mono text-[0.65rem] text-ivory/40 group-hover:text-mist-bright transition-colors duration-300">
        {String(index + 1).padStart(2, '0')}
      </span>

      <motion.div
        animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 right-6 w-9 h-9 rounded-full glass flex items-center justify-center"
      >
        <HiArrowUpRight className="text-ivory/70 group-hover:text-mist-bright transition-colors" size={16} />
      </motion.div>

      <div style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-display font-bold text-2xl text-ivory relative">{cat.title}</h3>
        <p className="text-sm text-ivory/55 mt-1.5 relative">{cat.desc}</p>
        <span className="inline-flex items-center gap-1.5 mt-3 text-[0.7rem] font-mono tracking-wide text-mist-bright/80 group-hover:text-mist-bright transition-colors">
          {hasCollection ? 'Explore collection' : 'Enquire on WhatsApp'}
          <HiArrowUpRight size={12} />
        </span>
      </div>
    </motion.button>
  );
}

export function Products() {
  return (
    <section id="collection" className="relative bg-matte py-14 sm:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <Eyebrow>The Collection</Eyebrow>
            <SplitReveal
              as="h2"
              text="A category for every way of seeing."
              className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
            />
          </div>
          <p className="text-sm text-ivory/45 max-w-xs font-light">
            Tap any category to browse the full collection — filter, explore and enquire on WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

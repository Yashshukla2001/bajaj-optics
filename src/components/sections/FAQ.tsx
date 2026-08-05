import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { FAQS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

function FlipCard({ q, a, index }: { q: string; a: string; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      onClick={() => setFlipped((f) => !f)}
      className="relative h-48 cursor-pointer"
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — question */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-mono text-[0.65rem] text-mist-bright">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="font-display font-bold text-lg text-ivory leading-snug">{q}</h3>
          <span className="text-[0.65rem] text-ivory/35 tracking-wide">Tap to reveal answer</span>
        </div>

        {/* Back — answer */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(150deg, rgba(143,176,196,0.14), rgba(21,23,27,0.9))',
            border: '1px solid rgba(143,176,196,0.3)',
          }}
        >
          <p className="text-sm text-ivory/80 leading-relaxed">{a}</p>
          <span className="flex items-center gap-1.5 text-[0.65rem] text-mist-bright tracking-wide">
            <HiArrowUturnLeft size={12} /> Tap to flip back
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section className="relative bg-matte py-14 sm:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Eyebrow>Questions, Answered</Eyebrow>
          <SplitReveal
            as="h2"
            text="Flip a card for the answer."
            className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FAQS.map((item, i) => (
            <FlipCard key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';

interface SplitRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

/** Reveals text word-by-word as it scrolls into view — used for every large heading. */
export function SplitReveal({ text, className, delay = 0, as = 'h2' }: SplitRevealProps) {
  const words = text.split(' ');
  const Tag = motion[as] as typeof motion.h2;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Small mono-spaced label used above section headings. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <motion.p
      className="eyebrow mb-4"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.p>
  );
}

import { useRef, useState, type ReactNode, type MouseEvent, type ElementType } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Variant = 'solid' | 'outline' | 'ghost';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/** A button that leans toward the cursor and ripples on click — used for every primary CTA. */
export function MagneticButton({ children, onClick, href, variant = 'solid', className, icon, type = 'button', disabled }: MagneticButtonProps) {
  const ref = useRef<any>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.28, y: y * 0.35 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  function handleClick(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    }
    onClick?.();
  }

  const base =
    'relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-body text-sm font-medium tracking-wide transition-colors duration-300';
  const variants: Record<Variant, string> = {
    solid: 'bg-ivory text-matte hover:bg-mist-bright',
    outline: 'border border-silver/40 text-ivory hover:border-mist-bright hover:text-mist-bright',
    ghost: 'text-ivory/80 hover:text-ivory',
  };

  const Tag = (href ? 'a' : 'button') as unknown as ElementType;

  return (
    <motion.div
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
      className="inline-block"
    >
      <Tag
        ref={ref}
        href={href}
        type={!href ? type : undefined}
        disabled={!href ? disabled : undefined}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={clsx(base, variants[variant], className, disabled && 'opacity-60 pointer-events-none')}
      >
        {icon}
        <span>{children}</span>
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-current/25 animate-[ripple_650ms_ease-out]"
            style={{ left: r.x, top: r.y, width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
          />
        ))}
      </Tag>
    </motion.div>
  );
}

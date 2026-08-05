import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LensRevealProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Smaller start radius = more dramatic "emerging from the lens" feel. */
  startRadius?: number;
}

/**
 * The site's signature scroll moment: content behind is revealed through an
 * expanding circular aperture — like walking through the lens itself.
 * Fully scrubbed to scroll position, so scrolling up reverses it exactly.
 */
export function LensReveal({ children, id, className, startRadius = 4 }: LensRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        maskRef.current,
        { clipPath: `circle(${startRadius}% at 50% 42%)`, filter: 'blur(6px)' },
        {
          clipPath: 'circle(75% at 50% 42%)',
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 85%',
            end: 'top 15%',
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        wrapRef.current,
        { '--ring-scale': 0.3, '--ring-opacity': 0.9 },
        {
          '--ring-scale': 1.6,
          '--ring-opacity': 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        }
      ) as unknown as void;
    }, wrapRef);
    return () => ctx.revert();
  }, [startRadius]);

  return (
    <div id={id} ref={wrapRef} className={`relative ${className ?? ''}`}>
      {/* Chromatic aperture ring — the "glass edge" of the transition */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-mist-bright/60"
        style={{
          transform: 'translate(-50%, -50%) scale(var(--ring-scale, 0.3))',
          opacity: 'var(--ring-opacity, 0.9)',
          boxShadow: '0 0 60px 10px rgba(143,176,196,0.15) inset',
        }}
      />
      <div ref={maskRef} style={{ clipPath: `circle(${startRadius}% at 50% 42%)` }}>
        {children}
      </div>
    </div>
  );
}

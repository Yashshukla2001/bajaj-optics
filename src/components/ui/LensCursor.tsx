import { useEffect, useRef, useState } from 'react';

/**
 * Replaces the system cursor with a small spectacle-lens glyph that trails
 * the mouse with a light spring lag, and subtly magnifies whatever sits
 * beneath it via backdrop-filter. Automatically disabled on touch devices
 * and respects prefers-reduced-motion.
 */
export function LensCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;
    setEnabled(true);

    function handleMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', handleMove);

    let raf: number;
    function loop() {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x - 22}px, ${pos.current.y - 22}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
      document.body.style.cursor = '';
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="fixed top-0 left-0 z-[90] w-11 h-11 pointer-events-none rounded-full mix-blend-difference"
      style={{
        border: '1px solid rgba(143,176,196,0.9)',
        backdropFilter: 'blur(1px) saturate(160%) brightness(1.15)',
        WebkitBackdropFilter: 'blur(1px) saturate(160%) brightness(1.15)',
        boxShadow: '0 0 18px rgba(143,176,196,0.35), inset 0 0 10px rgba(255,255,255,0.15)',
        willChange: 'transform',
      }}
    />
  );
}

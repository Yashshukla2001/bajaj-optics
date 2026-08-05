import { useRef, useState, useCallback, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { BUSINESS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const PHOTO_URL = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80&auto=format&fit=crop';

const MIN_ANGLE = -130;
const MAX_ANGLE = 130;

export function BeforeAfterVision() {
  const dialRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0); // 0 to 1
  const dragging = useRef(false);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angleRad = Math.atan2(clientY - cy, clientX - cx);
    let angleDeg = (angleRad * 180) / Math.PI + 90; // 0 at top
    if (angleDeg > 180) angleDeg -= 360;
    const clamped = Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, angleDeg));
    const v = (clamped - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE);
    setValue(v);
  }, []);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  }
  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    updateFromPointer(e.clientX, e.clientY);
  }
  function handlePointerUp() {
    dragging.current = false;
  }

  const knobAngle = MIN_ANGLE + value * (MAX_ANGLE - MIN_ANGLE);
  const diopter = (2.5 * (1 - value)).toFixed(2);
  const clarity = Math.round(value * 100);

 return (
    <section className="relative bg-matte py-14 sm:py-20 px-6 overflow-hidden">
      <div className="max-w-xl mx-auto text-center mb-8">
        <Eyebrow>See The Difference</Eyebrow>
        <SplitReveal
          as="h2"
          text="Turn the dial. Watch it resolve."
          className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
        />
        <p className="mt-3 text-ivory/45 text-sm">
          Just like a real prescription check at{' '}
          <span className="text-mist-bright font-medium">{BUSINESS.name}</span> — drag the dial to bring
          the world into focus.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-center pb-8">
        {/* The photo — revealed through a camera-aperture iris that opens as the dial turns */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto md:mx-0">
          {/* Permanently blurred base layer */}
          <div className="absolute inset-0 rounded-full overflow-hidden ring-1 ring-white/10">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${PHOTO_URL})`,
                backgroundPosition: 'center 22%',
                filter: 'blur(11px)',
                transform: 'scale(1.15)',
              }}
            />
            <div className="absolute inset-0 bg-matte/30" />
          </div>

          {/* Sharp layer, revealed through the growing iris opening */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ clipPath: `circle(${8 + value * 42}% at 50% 50%)` }}
          >
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${PHOTO_URL})`,
                backgroundPosition: 'center 22%',
                filter: `saturate(${0.6 + value * 0.4})`,
                transform: 'scale(1.15)',
              }}
            />
          </div>

          {/* Aperture blades — rotate open as value increases */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => {
              const baseAngle = (i / 8) * 360;
              const openAngle = baseAngle + value * 34;
              return (
                <motion.polygon
                  key={i}
                  points="100,100 100,-30 165,-10"
                  fill="#0A0B0D"
                  opacity={0.94}
                  style={{ originX: '100px', originY: '100px' }}
                  animate={{ rotate: openAngle }}
                  transition={{ type: 'tween', duration: 0.05 }}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 rounded-full ring-1 ring-mist-bright/30 pointer-events-none" />

          {/* Live readout, centered below */}
          <div className="absolute -bottom-14 inset-x-0 flex items-center justify-center gap-6 font-mono">
            <div className="text-center">
              <p className="text-[0.55rem] tracking-widest text-ivory/40">DIOPTER</p>
              <p className="text-sm text-ivory/80">{value < 0.97 ? `-${diopter}` : '0.00'}</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="text-center">
              <p className="text-[0.55rem] tracking-widest text-ivory/40">APERTURE</p>
              <p className="text-sm text-mist-bright">f/{(16 - value * 14.4).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* The dial itself */}
        <div className="flex flex-col items-center gap-6">
          <div
            ref={dialRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full glass cursor-grab active:cursor-grabbing touch-none select-none"
          >
            {/* Tick marks around the dial */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
              {Array.from({ length: 27 }).map((_, i) => {
                const a = ((MIN_ANGLE + (i / 26) * (MAX_ANGLE - MIN_ANGLE)) * Math.PI) / 180;
                const lit = i / 26 <= value;
                const x1 = 100 + 86 * Math.sin(a);
                const y1 = 100 - 86 * Math.cos(a);
                const x2 = 100 + 76 * Math.sin(a);
                const y2 = 100 - 86 * Math.cos(a) * (76 / 86);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={lit ? '#8FB0C4' : 'rgba(246,243,238,0.15)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* The knob indicator */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-mist-bright"
              style={{
                x: 55 * Math.sin((knobAngle * Math.PI) / 180) - 4,
                y: -55 * Math.cos((knobAngle * Math.PI) / 180) - 4,
              }}
            />

            {/* Center cap */}
            <div className="absolute inset-[28%] rounded-full bg-charcoal-soft border border-white/10 flex items-center justify-center">
              <span className="font-mono text-xs text-ivory/50">{clarity}%</span>
            </div>
          </div>

          <p className="text-[0.65rem] font-mono tracking-wide text-ivory/30 text-center max-w-[10rem]">
            <span className="text-mist-bright">{BUSINESS.name}</span> · Drag to adjust
          </p>
        </div>
      </div>
    </section>
  );
}
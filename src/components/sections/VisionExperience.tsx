import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eyebrow } from '@/components/ui/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  { letters: 'E', size: 88, acuity: 200 },
  { letters: 'F P', size: 64, acuity: 100 },
  { letters: 'T O Z', size: 46, acuity: 70 },
  { letters: 'L P E D', size: 32, acuity: 50 },
  { letters: 'P E C F D', size: 22, acuity: 30 },
  { letters: 'E D F C Z P', size: 15, acuity: 20 },
];

/**
 * A real Snellen acuity chart, blurred, sharpening row by row as a scan-line
 * passes down it on scroll — with a live 20/200 → 20/20 readout. Direct,
 * literal, and specific to an eye-care brand; fully reversible on scroll-up.
 */
export function VisionExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const acuityRef = useRef<HTMLSpanElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          scrub: true,
          pin: true,
        },
      });

      const acuityState = { value: 200 };

      tl.to(scanRef.current, { top: '92%', ease: 'none' }, 0);

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        tl.to(
          row,
          { filter: 'blur(0px)', opacity: 1, ease: 'none' },
          i * 0.16
        );
      });

      tl.to(
        acuityState,
        {
          value: 20,
          ease: 'none',
          onUpdate: () => {
            if (acuityRef.current) acuityRef.current.textContent = Math.round(acuityState.value).toString();
          },
        },
        0
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-matte flex flex-col pt-[calc(var(--navbar-height,64px)+2.5rem)] pb-10 px-6"
    >
      <div className="text-center shrink-0">
        <Eyebrow>The Vision Experience</Eyebrow>
      </div>

      {/* Horizontal layout — readout, chart, and caption side by side */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left — live acuity readout */}
          <div className="shrink-0 text-center lg:text-left">
            <p className="font-mono text-ivory/40 text-sm tracking-widest">
              20 / <span ref={acuityRef} className="text-mist-bright">200</span>
            </p>
            <p className="mt-2 text-[0.6rem] font-mono tracking-[0.15em] text-ivory/25 max-w-[10rem] mx-auto lg:mx-0">
              Scroll to bring it into focus
            </p>
          </div>

          {/* Center — the chart itself */}
          <div ref={chartRef} className="relative flex flex-col items-center gap-4 sm:gap-5">
            {ROWS.map((row, i) => (
              <div
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="font-display font-bold text-ivory/90 tracking-[0.3em]"
                style={{ fontSize: row.size * 0.8, filter: 'blur(9px)', opacity: 0.35 }}
              >
                {row.letters}
              </div>
            ))}

            {/* Scan-line sweeping down the chart */}
            <div ref={scanRef} className="absolute left-[-14%] right-[-14%] h-px" style={{ top: '4%' }}>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-mist-bright to-transparent" />
              <div className="absolute inset-x-0 -top-3 h-6 bg-gradient-to-b from-mist-bright/10 to-transparent blur-md" />
            </div>
          </div>

          {/* Right — a quiet supporting line, balances the row */}
          <div className="hidden lg:block shrink-0 max-w-[10rem] text-right">
            <p className="text-xs text-ivory/35 leading-relaxed">
              This is what a real eye test measures — row by row, until every letter is sharp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
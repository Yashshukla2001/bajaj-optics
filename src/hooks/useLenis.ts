import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scroll and syncs it with GSAP's ScrollTrigger
 * so every scrub-linked animation stays perfectly in step with the
 * (buttery) scroll position, in both directions.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReduced ? 0.1 : 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    // Make Lenis reachable from anywhere (e.g. the navbar's click handler),
    // so programmatic scrolling goes through Lenis instead of fighting it.
    (window as any).__lenis = lenis;

    // Lenis manages its own virtual scroll position — plain window.scrollTo()
    // calls made before or during its setup can get silently overridden once
    // its RAF loop starts. Force Lenis's own scroll position to 0 explicitly.
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      (window as any).__lenis = null;
    };
  }, []);

  return lenisRef;
}
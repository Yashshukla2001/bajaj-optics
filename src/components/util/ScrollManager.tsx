import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function navHeight(): number {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '64',
    10
  );
}

function scrollTopNow() {
  const lenis = (window as any).__lenis;
  if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
}

/**
 * Keeps scroll behaviour sane across routes: jumps to the top on a normal
 * navigation, and smooth-scrolls (through Lenis) to a #section when the URL
 * carries a hash — e.g. arriving at "/#collection" from a collection page.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Let the home sections mount, then glide to the target.
      const id = hash.replace('#', '');
      let tries = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          const lenis = (window as any).__lenis;
          if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -(navHeight() + 16), duration: 1.1 });
          else {
            const y = el.getBoundingClientRect().top + window.scrollY - (navHeight() + 16);
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else if (tries++ < 20) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
      return;
    }
    scrollTopNow();
  }, [pathname, hash]);

  return null;
}

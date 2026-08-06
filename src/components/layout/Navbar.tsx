import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiBars3 } from 'react-icons/hi2';
import { NAV_LINKS, whatsappMessage } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import logoIcon from '@/assets/images/logo-color-icon-pill (1).png';

function LensLogo() {
  return <img src={logoIcon} alt="" aria-hidden className="h-9 sm:h-10 w-auto shrink-0" />;
}

function useActiveSection() {
  const [active, setActive] = useState<string>('');
  const lockedUntil = useRef(0);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    let raf = 0;

    function computeActive() {
      if (performance.now() < lockedUntil.current) return;
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '64',
        10
      );
      const line = navHeight + 40;

      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeActive);
    }

    computeActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function setManualActive(id: string) {
    lockedUntil.current = performance.now() + 1200;
    setActive(id);
  }

  return { active, setManualActive };
}

/** Scrolls to a section through Lenis (not the browser's native anchor jump),
    accounting for the navbar's real height — this is what actually fixes
    "lands too far below" once and for all. */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '64',
    10
  );
  const lenis = (window as any).__lenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset: -(navHeight + 16), duration: 1.1 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - (navHeight + 16);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  history.replaceState(null, '', `#${id}`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { active, setManualActive } = useActiveSection();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function setHeight() {
      const h = headerRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    }
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [scrolled]);

  function handleNavClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setManualActive(id);
    scrollToSection(id);
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-5 sm:px-8"
      >
        <motion.div
          animate={{
            backgroundColor: scrolled ? 'rgba(10,11,13,0.75)' : 'rgba(10,11,13,0)',
            marginTop: scrolled ? 10 : 20,
          }}
          transition={{ duration: 0.4 }}
          style={{ backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none' }}
          className="max-w-7xl mx-auto rounded-2xl flex items-center justify-between px-4 py-2.5"
        >
          <a href="#top" onClick={(e) => handleNavClick(e, 'top')} className="flex items-center shrink-0">
            <LensLogo />
          </a>

          {/* Center — quiet text nav, active tab marked by a small dot above the label */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, id)}
                  className="relative flex flex-col items-center gap-1.5 py-2"
                >
                  <span
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-mist-bright opacity-100 scale-100' : 'bg-mist-bright opacity-0 scale-50'
                    }`}
                  />
                  <span
                    className={`text-[0.72rem] tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-ivory' : 'text-ivory/50 hover:text-ivory/80'
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={buildWhatsAppLink(whatsappMessage.eyeTest)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center rounded-full bg-mist-bright text-matte px-5 py-2.5 text-xs font-medium tracking-wide hover:bg-ivory transition-colors"
            >
              Book Eye Test
            </a>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden w-9 h-9 flex items-center justify-center text-ivory"
            >
              <HiBars3 size={20} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-matte flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/8">
              <LensLogo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center text-ivory"
              >
                <HiXMark size={22} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {NAV_LINKS.map((link, i) => {
                const id = link.href.replace('#', '');
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, id);
                      setOpen(false);
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-bold text-3xl text-ivory/80 hover:text-mist-bright transition-colors py-3 border-b border-white/8"
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>

            <a
              href={buildWhatsAppLink(whatsappMessage.eyeTest)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mx-8 mb-10 text-center rounded-full bg-mist-bright text-matte py-4 text-sm font-medium"
            >
              Book Eye Test
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
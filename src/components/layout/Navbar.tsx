import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiBars3, HiChevronDown } from 'react-icons/hi2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS, whatsappMessage } from '@/constants/business';
import { COLLECTION_CATEGORIES } from '@/data/products';
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

/** Scrolls to a section through Lenis, accounting for the navbar's real height. */
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
  const [collectionOpen, setCollectionOpen] = useState(false);
  const { active, setManualActive } = useActiveSection();
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === '/';

  // The bar is solid whenever we're not over the homepage hero, so page
  // content always scrolls cleanly *behind* it rather than showing through.
  const showBg = !onHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close both menus whenever the route changes.
  useEffect(() => {
    setCollectionOpen(false);
    setOpen(false);
  }, [location.pathname]);

  // Publish the real navbar height so every page can offset content below it.
  useEffect(() => {
    function setHeight() {
      const h = headerRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    }
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [showBg]);

  // Route-aware section navigation: if we're on a collection/detail page, go
  // home first (ScrollManager then glides to the section); otherwise scroll now.
  function handleNavClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setCollectionOpen(false);
    if (!onHome) {
      navigate(id === 'top' ? '/' : `/#${id}`);
      return;
    }
    setManualActive(id);
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToSection(id);
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <motion.div
          animate={{ backgroundColor: showBg ? 'rgba(10,11,13,0.82)' : 'rgba(10,11,13,0)' }}
          transition={{ duration: 0.35 }}
          style={{
            backdropFilter: showBg ? 'blur(16px) saturate(140%)' : 'none',
            WebkitBackdropFilter: showBg ? 'blur(16px) saturate(140%)' : 'none',
            borderBottom: showBg ? '1px solid rgba(246,243,238,0.08)' : '1px solid rgba(246,243,238,0)',
          }}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3">
            <a href="#top" onClick={(e) => handleNavClick(e, 'top')} className="flex items-center shrink-0">
              <LensLogo />
            </a>

            {/* Center — quiet text nav; the "Collection" entry expands into categories */}
            <nav className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = active === id;
                const isCollection = id === 'collection';

                if (isCollection) {
                  return (
                    <div
                      key={link.href}
                      className="relative flex flex-col items-center"
                      onMouseEnter={() => setCollectionOpen(true)}
                      onMouseLeave={() => setCollectionOpen(false)}
                    >
                      <a
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
                          className={`flex items-center gap-1 text-[0.72rem] tracking-wide transition-colors duration-300 ${
                            isActive ? 'text-ivory' : 'text-ivory/50 hover:text-ivory/80'
                          }`}
                        >
                          {link.label}
                          <HiChevronDown
                            size={11}
                            className={`opacity-60 transition-transform duration-300 ${collectionOpen ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </a>

                      {/* Dropdown — state-controlled so it closes on select & on navigation */}
                      <AnimatePresence>
                        {collectionOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full pt-3 left-1/2 -translate-x-1/2"
                          >
                            <div className="glass-light rounded-2xl p-2 w-56 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                              {COLLECTION_CATEGORIES.map((c) => (
                                <Link
                                  key={c.id}
                                  to={`/collections/${c.id}`}
                                  onClick={() => setCollectionOpen(false)}
                                  className="block rounded-xl px-3.5 py-2.5 text-[0.8rem] text-ivory/70 hover:text-ivory hover:bg-white/5 transition-colors"
                                >
                                  {c.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

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

            <nav className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center px-8 gap-1">
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

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6"
              >
                <p className="eyebrow !text-[0.6rem] mb-3">Shop by Category</p>
                <div className="flex flex-col gap-1">
                  {COLLECTION_CATEGORIES.map((c) => (
                    <Link
                      key={c.id}
                      to={`/collections/${c.id}`}
                      onClick={() => setOpen(false)}
                      className="text-base text-ivory/65 hover:text-mist-bright transition-colors py-1.5"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
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

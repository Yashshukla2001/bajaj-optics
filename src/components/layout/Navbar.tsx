import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiBars3, HiChevronDown, HiMagnifyingGlass, HiOutlineHeart, HiChevronRight } from 'react-icons/hi2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS, whatsappMessage, BUSINESS } from '@/constants/business';
import { COLLECTION_CATEGORIES, PRODUCTS, getCategoryMeta } from '@/data/products';
import type { CategoryId } from '@/types/product';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { megaGroupsFor, tagLabel } from '@/utils/catalog';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductImage } from '@/components/collection/ProductImage';
import logoIcon from '@/assets/images/logo-color-icon-pill (1).png';

const EASE = [0.16, 1, 0.3, 1] as const;

// Order categories for the shop bar (sunglasses first, smart glasses last).
const CAT_ORDER: CategoryId[] = ['sunglasses', 'prescription', 'bluecut', 'office', 'kids', 'contact-lens', 'smart-glasses'];
const SHOP_CATS = CAT_ORDER
  .map((id) => COLLECTION_CATEGORIES.find((c) => c.id === id))
  .filter((c): c is NonNullable<typeof c> => !!c);

// Short labels keep the category bar compact and responsive across widths.
const NAV_LABEL: Record<string, string> = {
  sunglasses: 'Sunglasses',
  prescription: 'Eyeglasses',
  bluecut: 'Blue-Cut',
  office: 'Office',
  kids: 'Kids',
  'contact-lens': 'Contacts',
  'smart-glasses': 'Smart Glasses',
};

// Page/section quick links (the shop lives in the category bar below).
const PAGE_LINKS = NAV_LINKS.filter((l) => !['collection', 'frames'].includes(l.href.replace('#', '')));

function LensLogo() {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <img src={logoIcon} alt="" aria-hidden className="h-8 sm:h-10 w-auto shrink-0" />
      <span className="font-display font-bold text-ivory leading-none tracking-tight text-base sm:text-xl whitespace-nowrap">
        {BUSINESS.name}
      </span>
    </span>
  );
}

// ---- Search with live product suggestions ---------------------------------
function SearchBox({ onNavigate, autoFocus }: { onNavigate?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.frameShape, p.frameMaterial, p.color, p.category].filter(Boolean).join(' ').toLowerCase().includes(s)
    ).slice(0, 6);
  }, [q]);

  function go(to: string) {
    setQ('');
    setOpen(false);
    onNavigate?.();
    navigate(to);
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) go(`/collections/${results[0].category}/${results[0].slug}`);
        }}
      >
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40" size={16} />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search frames, shapes, colours…"
          aria-label="Search products"
          className="w-full glass rounded-full pl-11 pr-10 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-mist-bright/40"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Clear" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory">
            <HiXMark size={16} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 inset-x-0 glass-light rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] z-[80]"
          >
            {results.map((p) => (
              <button key={p.id} onMouseDown={() => go(`/collections/${p.category}/${p.slug}`)}
                className="flex items-center gap-3 w-full rounded-xl p-2 hover:bg-white/5 transition-colors text-left">
                <span className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
                  <ProductImage src={p.images[0]} alt="" className="w-full h-full object-cover" sizes="44px" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-ivory truncate">{p.name}</span>
                  <span className="block text-[0.68rem] text-ivory/45 truncate">
                    {getCategoryMeta(p.category)?.title} · {p.frameShape}
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Mega-menu panel for one category -------------------------------------
function CategoryMega({ catId }: { catId: CategoryId }) {
  const meta = getCategoryMeta(catId)!;
  const groups = megaGroupsFor(catId);
  return (
    <div className="rounded-2xl p-5 w-max max-w-[calc(100vw-1.5rem)] bg-charcoal border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
      <div className="flex gap-7">
        {groups.map((g) => (
          <div key={g.label} className="min-w-[8rem]">
            <p className="eyebrow !text-[0.58rem] mb-2.5">{g.label}</p>
            <div className="flex flex-col gap-1">
              {g.items.map((item) => (
                <Link key={item} to={`/collections/${catId}?${g.param}=${encodeURIComponent(item)}`}
                  className="text-[0.82rem] text-ivory/65 hover:text-mist-bright transition-colors">
                  {g.param === 'collection' ? tagLabel(item) : item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link to={`/collections/${catId}`} className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] text-mist-bright hover:text-ivory transition-colors">
        View all {meta.title} <HiChevronRight size={13} />
      </Link>
    </div>
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '64', 10);
  const lenis = (window as any).__lenis;
  if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -(navHeight + 16), duration: 1.1 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (navHeight + 16), behavior: 'smooth' });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [activeCat, setActiveCat] = useState<CategoryId | null>(null);
  const [menuLeft, setMenuLeft] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === '/';
  const { count } = useWishlist();

  const showBg = !onHome || scrolled;
  // Over the homepage hero we keep the bar minimal and transparent — no search
  // bar or category row — so it doesn't clutter the cinematic opening.
  const atHeroTop = onHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setActiveCat(null); setOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    const setHeight = () => document.documentElement.style.setProperty('--navbar-height', `${headerRef.current?.offsetHeight ?? 64}px`);
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [showBg, atHeroTop, location.pathname]);

  // Open a category menu and place its panel so it always stays on-screen —
  // measured from the hovered item, clamped to the viewport on both edges.
  function openCat(id: CategoryId, el: HTMLElement) {
    setActiveCat(id);
    const rect = el.getBoundingClientRect();
    const panelW = Math.min(512, window.innerWidth - 32); // matches CategoryMega width
    const margin = 12;
    let vpLeft = rect.left;
    if (vpLeft + panelW > window.innerWidth - margin) vpLeft = window.innerWidth - margin - panelW;
    if (vpLeft < margin) vpLeft = margin;
    setMenuLeft(vpLeft - rect.left); // convert to offset local to the item
  }

  function handlePageLink(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (!onHome) { navigate(id === 'top' ? '/' : `/#${id}`); return; }
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToSection(id);
  }

  return (
    <>
      <motion.header ref={headerRef} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }} className="fixed top-0 inset-x-0 z-50">
        <motion.div
          animate={{ backgroundColor: showBg ? 'rgba(10,11,13,0.9)' : 'rgba(10,11,13,0)' }}
          transition={{ duration: 0.35 }}
          style={{
            backdropFilter: showBg ? 'blur(16px) saturate(140%)' : 'none',
            WebkitBackdropFilter: showBg ? 'blur(16px) saturate(140%)' : 'none',
            borderBottom: showBg ? '1px solid rgba(246,243,238,0.08)' : '1px solid rgba(246,243,238,0)',
          }}
          className="w-full"
          onMouseLeave={() => setActiveCat(null)}
        >
          {/* Row 1 — logo · search · actions */}
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3">
            <a href="#top" onClick={(e) => handlePageLink(e, 'top')} aria-label={`${BUSINESS.name} — home`} className="flex items-center shrink-0">
              <LensLogo />
            </a>

            <div className={`hidden md:block flex-1 max-w-md mx-auto transition-opacity ${atHeroTop ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {!atHeroTop && <SearchBox />}
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
              {!atHeroTop && (
                <nav className="hidden lg:flex items-center gap-5 mr-1">
                  {PAGE_LINKS.map((l) => (
                    <a key={l.href} href={l.href} onClick={(e) => handlePageLink(e, l.href.replace('#', ''))}
                      className="py-1 text-[0.72rem] tracking-wide whitespace-nowrap text-ivory/55 hover:text-ivory transition-colors">
                      {l.label}
                    </a>
                  ))}
                </nav>
              )}

              <Link to="/wishlist" aria-label="Wishlist" className="relative w-9 h-9 flex items-center justify-center text-ivory/80 hover:text-mist-bright transition-colors">
                <HiOutlineHeart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-1 rounded-full bg-mist-bright text-matte text-[0.58rem] font-medium flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              <a href={buildWhatsAppLink(whatsappMessage.eyeTest)} target="_blank" rel="noopener noreferrer"
                className="hidden md:inline-flex items-center rounded-full bg-mist-bright text-matte px-5 py-2.5 text-xs font-medium tracking-wide hover:bg-ivory transition-colors">
                Book Eye Test
              </a>

              {!atHeroTop && (
                <button onClick={() => setMobileSearch((s) => !s)} aria-label="Search" className="md:hidden w-9 h-9 flex items-center justify-center text-ivory">
                  <HiMagnifyingGlass size={19} />
                </button>
              )}
              <button onClick={() => setOpen(true)} aria-label="Open menu" className="md:hidden w-9 h-9 flex items-center justify-center text-ivory">
                <HiBars3 size={20} />
              </button>
            </div>
          </div>

          {/* Mobile inline search */}
          <AnimatePresence>
            {mobileSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-visible px-5 pb-3">
                <SearchBox autoFocus onNavigate={() => setMobileSearch(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 2 — category mega-menu bar (desktop). Hidden over the hero. */}
          <AnimatePresence initial={false}>
            {!atHeroTop && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="hidden md:block border-t border-white/5 overflow-visible"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
              <nav className="flex items-center gap-3 lg:gap-6 min-w-0">
                {SHOP_CATS.map((c) => (
                  <div key={c.id} className="relative shrink-0" onMouseEnter={(e) => openCat(c.id, e.currentTarget)}>
                    <Link to={`/collections/${c.id}`}
                      className={`flex items-center gap-1 py-3 text-[0.7rem] lg:text-[0.74rem] tracking-wide whitespace-nowrap transition-colors ${activeCat === c.id ? 'text-mist-bright' : 'text-ivory/70 hover:text-ivory'}`}>
                      {NAV_LABEL[c.id] ?? c.title}
                      {megaGroupsFor(c.id).length > 0 && (
                        <HiChevronDown size={11} className={`opacity-60 transition-transform ${activeCat === c.id ? 'rotate-180' : ''}`} />
                      )}
                    </Link>
                    <AnimatePresence>
                      {activeCat === c.id && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.22, ease: EASE }} style={{ left: menuLeft }} className="absolute top-full pt-2 z-[60]">
                          <CategoryMega catId={c.id} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      {/* Mobile full menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-matte flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <LensLogo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center text-ivory">
                <HiXMark size={22} />
              </button>
            </div>

            <div className="px-6 pt-4"><SearchBox onNavigate={() => setOpen(false)} /></div>

            <nav className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
              <p className="eyebrow !text-[0.6rem] mb-3">Shop by Category</p>
              <div className="flex flex-col">
                {SHOP_CATS.map((c) => (
                  <Link key={c.id} to={`/collections/${c.id}`} onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-white/8 font-display font-bold text-xl text-ivory/85 hover:text-mist-bright transition-colors">
                    {c.title} <HiChevronRight size={16} className="text-ivory/30" />
                  </Link>
                ))}
              </div>

              <p className="eyebrow !text-[0.6rem] mt-6 mb-2">More</p>
              <div className="flex flex-col">
                {PAGE_LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={(e) => { handlePageLink(e, l.href.replace('#', '')); setOpen(false); }}
                    className="py-2.5 text-base text-ivory/65 hover:text-mist-bright transition-colors">
                    {l.label}
                  </a>
                ))}
                <Link to="/wishlist" onClick={() => setOpen(false)} className="py-2.5 text-base text-ivory/65 hover:text-mist-bright transition-colors">
                  Wishlist{count > 0 ? ` (${count})` : ''}
                </Link>
              </div>
            </nav>

            <a href={buildWhatsAppLink(whatsappMessage.eyeTest)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              className="mx-6 mb-8 text-center rounded-full bg-mist-bright text-matte py-4 text-sm font-medium">
              Book Eye Test
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

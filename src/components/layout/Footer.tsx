import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BUSINESS, NAV_LINKS } from '@/constants/business';
import { COLLECTION_CATEGORIES } from '@/data/products';
import logoIcon from '@/assets/images/logo-icon.png';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Route-aware section link: on any non-home page, go home first (ScrollManager
  // then scrolls to the section); on home, just scroll to it.
  function goToSection(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '64', 10);
    const lenis = (window as any).__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -(navH + 16), duration: 1.1 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (navH + 16), behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }

  return (
    <footer className="relative bg-matte border-t border-white/5 px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
              <img src={logoIcon} alt="" aria-hidden className="h-7 w-auto" />
              <p className="font-display text-2xl text-ivory">{BUSINESS.name}</p>
            </div>
            <p className="text-xs text-ivory/40 mt-1 font-light max-w-xs">
              © {new Date().getFullYear()} {BUSINESS.name}. Crafted by <span className="text-ivory/60">Exsora</span>.
            </p>
          </div>

          {/* Shop */}
          <nav className="text-center md:text-left">
            <p className="eyebrow !text-[0.58rem] mb-3">Shop</p>
            <div className="flex flex-col gap-2">
              {COLLECTION_CATEGORIES.map((c) => (
                <Link key={c.id} to={`/collections/${c.id}`} className="text-xs text-ivory/50 hover:text-mist-bright transition-colors tracking-wide">
                  {c.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Explore (section links — now work from any page) */}
          <nav className="text-center md:text-left">
            <p className="eyebrow !text-[0.58rem] mb-3">Explore</p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => {
                const id = l.href.replace('#', '');
                return (
                  <a key={l.href} href={`/#${id}`} onClick={(e) => goToSection(e, id)}
                    className="text-xs text-ivory/50 hover:text-mist-bright transition-colors tracking-wide">
                    {l.label}
                  </a>
                );
              })}
              <Link to="/wishlist" className="text-xs text-ivory/50 hover:text-mist-bright transition-colors tracking-wide">
                Wishlist
              </Link>
            </div>
          </nav>
        </div>

        <p className="eyebrow !text-[0.6rem] text-center md:text-right mt-10">
          Creating Digital Identity of Every Business in India
        </p>
      </div>
    </footer>
  );
}

import { BUSINESS, NAV_LINKS } from '@/constants/business';
import logoIcon from '@/assets/images/logo-icon.png';

function LensLogo() {
  return <img src={logoIcon} alt="" aria-hidden className="h-7 w-auto" />;
}

export function Footer() {
  return (
    <footer className="relative bg-matte border-t border-white/5 px-6 py-14">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
          <img src={logoIcon} alt="" aria-hidden className="h-7 w-auto" />
          <p className="font-display text-2xl text-ivory">{BUSINESS.name}</p>
          </div>
          <p className="text-xs text-ivory/40 mt-1 font-light">
            © {new Date().getFullYear()} {BUSINESS.name}. Crafted by{' '}
            <span className="text-ivory/60">Exsora</span>.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-xs text-ivory/50 hover:text-mist-bright transition-colors tracking-wide">
              {l.label}
            </a>
          ))}
        </nav>

        <p className="eyebrow !text-[0.6rem] text-center md:text-right">
          Creating Digital Identity<br />of Every Business in India
        </p>
      </div>
    </footer>
  );
}

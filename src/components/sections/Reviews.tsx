import { FaStar, FaGoogle } from 'react-icons/fa';
import { BUSINESS, REVIEWS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

function ReviewCard({ name, rating, text }: (typeof REVIEWS)[number]) {
  return (
    <div className="shrink-0 w-[23rem] glass rounded-2xl p-7 mx-2.5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} size={13} className="text-mist-bright" />
          ))}
        </div>
        <FaGoogle className="text-ivory/25" size={14} />
      </div>
      <p className="text-sm text-ivory/70 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-white/8">
        <div className="w-7 h-7 rounded-full bg-mist/20 flex items-center justify-center font-mono text-[0.6rem] text-mist-bright shrink-0">
          {name.split(' ').map((n) => n[0]).join('')}
        </div>
        <p className="text-xs text-ivory/50 font-mono tracking-wide">{name}</p>
      </div>
    </div>
  );
}

export function Reviews() {
  const rowA = [...REVIEWS, ...REVIEWS];
  const rowB = [...REVIEWS.slice().reverse(), ...REVIEWS.slice().reverse()];

 return (
    <section id="reviews" className="relative bg-matte py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>What People Say</Eyebrow>
          <SplitReveal
            as="h2"
            text="Trusted across the city."
            className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
          />
        </div>

        {/* Prominent Google rating badge */}
        <div className="flex items-center gap-4 glass rounded-2xl px-6 py-4">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <FaGoogle className="text-charcoal" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-ivory">{BUSINESS.googleRating}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={11} className="text-mist-bright" />
                ))}
              </div>
            </div>
            <p className="text-xs text-ivory/45 mt-0.5">
              {BUSINESS.googleReviewCount.toLocaleString('en-IN')} Google reviews
            </p>
          </div>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-matte to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-matte to-transparent z-10" />
        <div className="flex w-max hover:[animation-play-state:paused]" style={{ animation: 'marquee 46s linear infinite' }}>
          {rowA.map((r, i) => (
            <ReviewCard key={`a-${i}`} {...r} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (opposite direction) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-matte to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-matte to-transparent z-10" />
        <div
          className="flex w-max hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 52s linear infinite reverse' }}
        >
          {rowB.map((r, i) => (
            <ReviewCard key={`b-${i}`} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
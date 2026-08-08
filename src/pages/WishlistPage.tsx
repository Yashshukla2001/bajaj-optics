import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronRight, HiOutlineHeart } from 'react-icons/hi2';
import { PRODUCTS } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/collection/ProductCard';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { Seo } from '@/components/Seo';

export function WishlistPage() {
  const { ids, count, clear } = useWishlist();
  const saved = useMemo(() => PRODUCTS.filter((p) => ids.includes(p.id)), [ids]);

  return (
    <main className="relative bg-matte min-h-screen">
      <Seo title="Your Wishlist" description="Frames you've saved at Bajaj Optics, Dewas." path="/wishlist" />

      <div className="max-w-6xl mx-auto px-6 pt-[calc(var(--navbar-height,64px)+2.5rem)] pb-20">
        <nav className="flex items-center gap-1.5 text-[0.7rem] text-ivory/40 mb-5">
          <Link to="/" className="hover:text-mist-bright transition-colors">Home</Link>
          <HiChevronRight size={12} />
          <span className="text-ivory/70">Wishlist</span>
        </nav>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>{count > 0 ? `${count} saved` : 'Saved frames'}</Eyebrow>
            <SplitReveal as="h1" text="Your Wishlist" className="font-display font-bold text-4xl sm:text-6xl text-ivory leading-[1.05]" />
          </div>
          {count > 0 && (
            <button onClick={clear} className="text-xs text-ivory/50 hover:text-mist-bright transition-colors underline underline-offset-4">
              Clear all
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="glass rounded-3xl py-24 px-8 text-center mt-10">
            <HiOutlineHeart size={40} className="mx-auto text-ivory/30" />
            <p className="font-display font-bold text-2xl text-ivory mt-4">Nothing saved yet.</p>
            <p className="text-sm text-ivory/50 mt-2">Tap the heart on any frame to keep it here for later.</p>
            <Link to="/collections/sunglasses" className="mt-6 inline-flex rounded-full bg-mist-bright text-matte px-6 py-3 text-sm font-medium hover:bg-ivory transition-colors">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-10">
            {saved.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

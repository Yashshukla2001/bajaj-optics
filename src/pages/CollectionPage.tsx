import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAdjustmentsHorizontal, HiMagnifyingGlass, HiXMark, HiChevronRight } from 'react-icons/hi2';
import type { CategoryId, SortId } from '@/types/product';
import { SORT_OPTIONS } from '@/types/product';
import { getCategoryMeta, getProductsByCategory, isCollectionCategory } from '@/data/products';
import { useCollectionFilters } from '@/hooks/useCollectionFilters';
import { ProductCard } from '@/components/collection/ProductCard';
import { FilterControls, MobileFilterSheet } from '@/components/collection/FilterPanel';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { Seo } from '@/components/Seo';

const PAGE_SIZE = 9;

export function CollectionPage() {
  const { category } = useParams<{ category: string }>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const valid = category && isCollectionCategory(category);
  const catId = category as CategoryId;
  const meta = valid ? getCategoryMeta(catId) : undefined;
  const products = useMemo(() => (valid ? getProductsByCategory(catId) : []), [valid, catId]);

  const {
    filters,
    sort,
    setSort,
    availableFacets,
    priceBounds,
    filtered,
    toggleFacet,
    setPrice,
    setQuery,
    reset,
    activeCount,
  } = useCollectionFilters(products);

  // Reset the progressive page window whenever the result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filtered.length]);

  if (!valid || !meta) return <Navigate to="/" replace />;

  const shown = filtered.slice(0, visible);

  return (
    <main className="relative bg-matte min-h-screen">
      <Seo
        title={`${meta.title} Collection`}
        description={`Explore ${products.length} ${meta.title.toLowerCase()} at Bajaj Optics, Dewas. ${meta.desc} Filter by shape, material and more, then enquire on WhatsApp.`}
        path={`/collections/${catId}`}
        image={meta.image}
      />

      {/* Header */}
      <header className="relative px-6 pt-[calc(var(--navbar-height,64px)+2.5rem)] pb-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1.5 text-[0.7rem] text-ivory/40 mb-6">
            <Link to="/" className="hover:text-mist-bright transition-colors">Home</Link>
            <HiChevronRight size={12} />
            <Link to="/#collection" className="hover:text-mist-bright transition-colors">Collection</Link>
            <HiChevronRight size={12} />
            <span className="text-ivory/70">{meta.title}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>{`${products.length} Frames`}</Eyebrow>
              <SplitReveal
                as="h1"
                text={meta.title}
                className="font-display font-bold text-4xl sm:text-6xl text-ivory leading-[1.05]"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-sm sm:text-base text-ivory/55 mt-4 font-light max-w-lg"
              >
                {meta.desc} Every piece is available to try in-store — tap any frame to see details and enquire on WhatsApp.
              </motion.p>
            </div>
          </div>
        </div>
      </header>

      {/* Controls bar */}
      <div className="sticky top-[var(--navbar-height,64px)] z-30 px-6 py-3 bg-matte/80 backdrop-blur-md border-y border-white/5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/40" size={15} />
            <input
              value={filters.query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search frames…"
              aria-label="Search frames"
              className="w-full glass rounded-full pl-9 pr-9 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none"
            />
            {filters.query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory"
              >
                <HiXMark size={15} />
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* Sort */}
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="glass rounded-full pl-4 pr-9 py-2.5 text-sm text-ivory/80 appearance-none cursor-pointer focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-charcoal text-ivory">
                    {o.label}
                  </option>
                ))}
              </select>
              <HiChevronRight size={13} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-ivory/40" />
            </label>

            {/* Mobile filter trigger */}
            {availableFacets.length > 0 && (
              <button
                onClick={() => setSheetOpen(true)}
                className="lg:hidden relative glass rounded-full px-4 py-2.5 text-sm text-ivory/80 flex items-center gap-2"
              >
                <HiAdjustmentsHorizontal size={15} />
                Filters
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[1.1rem] px-1 rounded-full bg-mist-bright text-matte text-[0.6rem] font-medium flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body: desktop sidebar + grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-10">
          {availableFacets.length > 0 && (
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-[calc(var(--navbar-height,64px)+5rem)]">
                <FilterControls
                  facets={availableFacets}
                  filters={filters}
                  priceBounds={priceBounds}
                  activeCount={activeCount}
                  onToggle={toggleFacet}
                  onPrice={setPrice}
                  onReset={reset}
                />
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs text-ivory/45 mb-5 font-mono tracking-wide">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>

            {filtered.length === 0 ? (
              <div className="glass rounded-3xl py-20 px-8 text-center">
                <p className="font-display font-bold text-2xl text-ivory">No frames match those filters.</p>
                <p className="text-sm text-ivory/50 mt-2">Try clearing a filter or two to see more of the collection.</p>
                <button
                  onClick={reset}
                  className="mt-6 inline-flex rounded-full bg-mist-bright text-matte px-6 py-3 text-sm font-medium hover:bg-ivory transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <AnimatePresence mode="popLayout">
                    {shown.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {visible < filtered.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="rounded-full glass px-7 py-3.5 text-sm text-ivory/80 hover:text-mist-bright hover:border-mist-bright/40 transition-colors"
                    >
                      Load more ({filtered.length - visible} left)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={filtered.length}>
        <FilterControls
          facets={availableFacets}
          filters={filters}
          priceBounds={priceBounds}
          activeCount={activeCount}
          onToggle={toggleFacet}
          onPrice={setPrice}
          onReset={reset}
        />
      </MobileFilterSheet>
    </main>
  );
}

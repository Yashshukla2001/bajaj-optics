import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiAdjustmentsHorizontal, HiMagnifyingGlass, HiXMark, HiChevronRight,
  HiBars3, HiSquares2X2, HiArrowsUpDown,
} from 'react-icons/hi2';
import type { CategoryId, SortId, FacetKey } from '@/types/product';
import { SORT_OPTIONS } from '@/types/product';
import { getCategoryMeta, getProductsByCategory, isCollectionCategory } from '@/data/products';
import { useCollectionFilters, type InitialFilters } from '@/hooks/useCollectionFilters';
import { ProductCard, ProductListItem } from '@/components/collection/ProductCard';
import { FilterControls, MobileFilterSheet } from '@/components/collection/FilterPanel';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { tagLabel } from '@/utils/catalog';
import { Seo } from '@/components/Seo';

const PAGE_SIZE = 9;
const PARAM_TO_FACET: Record<string, FacetKey> = {
  shape: 'frameShape', style: 'gender', material: 'frameMaterial',
  color: 'color', lens: 'lensType', collection: 'tags',
};

function parseInitial(sp: URLSearchParams): { initial: InitialFilters; view: 'grid' | 'list' } {
  const facets: Partial<Record<FacetKey, string[]>> = {};
  for (const [param, key] of Object.entries(PARAM_TO_FACET)) {
    const v = sp.get(param);
    if (v) facets[key] = v.split(',');
  }
  const sort = (sp.get('sort') as SortId) || undefined;
  const query = sp.get('q') || undefined;
  const view = sp.get('view') === 'list' ? 'list' : 'grid';
  return { initial: { facets, sort, query }, view };
}

// Outer: validate route, then mount a fresh view per category + query string.
export function CollectionPage() {
  const { category } = useParams<{ category: string }>();
  const [sp] = useSearchParams();
  if (!category || !isCollectionCategory(category)) return <Navigate to="/" replace />;
  return <CollectionView key={`${category}?${sp.toString()}`} catId={category as CategoryId} />;
}

function CollectionView({ catId }: { catId: CategoryId }) {
  const [sp] = useSearchParams();
  const { initial, view: initialView } = useMemo(() => parseInitial(sp), [sp]);

  const meta = getCategoryMeta(catId)!;
  const products = useMemo(() => getProductsByCategory(catId), [catId]);

  const {
    filters, sort, setSort, availableFacets, priceBounds, filtered,
    toggleFacet, removeFacet, setPrice, setQuery, reset, activeCount,
  } = useCollectionFilters(products, initial);

  const [view, setView] = useState<'grid' | 'list'>(initialView);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => { setVisible(PAGE_SIZE); }, [filtered.length, view]);

  const shown = filtered.slice(0, visible);

  // Flatten active selections into removable chips.
  const chips: { key: FacetKey; value: string; label: string }[] = [];
  for (const [key, vals] of Object.entries(filters.facets) as [FacetKey, string[]][]) {
    for (const v of vals ?? []) chips.push({ key, value: v, label: key === 'tags' ? tagLabel(v) : v });
  }

  const controls = (
    <FilterControls
      facets={availableFacets} filters={filters} priceBounds={priceBounds} activeCount={activeCount}
      onToggle={toggleFacet} onPrice={setPrice} onReset={reset}
    />
  );

  return (
    <main className="relative bg-matte min-h-screen pb-24 lg:pb-0">
      <Seo
        title={`${meta.title} Collection`}
        description={`Explore ${products.length} ${meta.title.toLowerCase()} at Bajaj Optics, Dewas. ${meta.desc} Filter by shape, material and more, then enquire on WhatsApp.`}
        path={`/collections/${catId}`}
        image={meta.image}
      />

      {/* Header */}
      <header className="px-6 pt-[calc(var(--navbar-height,64px)+2rem)] pb-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1.5 text-[0.7rem] text-ivory/40 mb-5">
            <Link to="/" className="hover:text-mist-bright transition-colors">Home</Link>
            <HiChevronRight size={12} />
            <Link to="/#collection" className="hover:text-mist-bright transition-colors">Collection</Link>
            <HiChevronRight size={12} />
            <span className="text-ivory/70">{meta.title}</span>
          </nav>
          <Eyebrow>{`${products.length} Frames`}</Eyebrow>
          <SplitReveal as="h1" text={meta.title} className="font-display font-bold text-4xl sm:text-6xl text-ivory leading-[1.05]" />
          <p className="text-sm text-ivory/55 mt-3 max-w-lg font-light">{meta.desc}</p>
        </div>
      </header>

      {/* Sticky controls: count + chips (left) · view + sort (right) */}
      <div className="sticky top-[var(--navbar-height,64px)] z-30 bg-matte/85 backdrop-blur-md border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <p className="text-xs text-ivory/50 font-mono tracking-wide shrink-0">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>

          {/* Selected chips — desktop */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            {chips.map((c) => (
              <button key={`${c.key}-${c.value}`} onClick={() => removeFacet(c.key, c.value)}
                className="shrink-0 inline-flex items-center gap-1.5 glass rounded-full pl-3 pr-2 py-1 text-[0.7rem] text-ivory/75 hover:text-ivory">
                {c.label}
                <HiXMark size={12} className="text-ivory/50" />
              </button>
            ))}
            {activeCount > 0 && (
              <button onClick={reset} className="shrink-0 text-[0.7rem] text-ivory/45 hover:text-mist-bright underline underline-offset-2">
                Clear
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2.5 shrink-0">
            {/* View toggle */}
            <div className="hidden sm:flex items-center glass rounded-full p-0.5">
              <button onClick={() => setView('grid')} aria-label="Grid view"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-mist-bright text-matte' : 'text-ivory/60'}`}>
                <HiSquares2X2 size={15} />
              </button>
              <button onClick={() => setView('list')} aria-label="List view"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${view === 'list' ? 'bg-mist-bright text-matte' : 'text-ivory/60'}`}>
                <HiBars3 size={15} />
              </button>
            </div>

            {/* Sort — desktop */}
            <label className="relative hidden lg:block">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortId)}
                className="glass rounded-full pl-4 pr-9 py-2.5 text-sm text-ivory/80 appearance-none cursor-pointer focus:outline-none">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-charcoal text-ivory">{o.label}</option>
                ))}
              </select>
              <HiChevronRight size={13} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-ivory/40" />
            </label>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          {availableFacets.length > 0 && (
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-[calc(var(--navbar-height,64px)+5rem)] max-h-[calc(100vh-var(--navbar-height,64px)-6rem)] overflow-y-auto no-scrollbar pr-1">
                <p className="eyebrow mb-4">Filters</p>
                {controls}
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative max-w-xs mb-6">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/40" size={15} />
              <input value={filters.query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this collection…"
                aria-label="Search this collection"
                className="w-full glass rounded-full pl-9 pr-9 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none" />
              {filters.query && (
                <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory">
                  <HiXMark size={15} />
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="glass rounded-3xl py-20 px-8 text-center">
                <p className="font-display font-bold text-2xl text-ivory">No frames match those filters.</p>
                <p className="text-sm text-ivory/50 mt-2">Try clearing a filter or two to see more of the collection.</p>
                <button onClick={reset} className="mt-6 inline-flex rounded-full bg-mist-bright text-matte px-6 py-3 text-sm font-medium hover:bg-ivory transition-colors">
                  Clear filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {shown.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {shown.map((p, i) => <ProductListItem key={p.id} product={p} index={i} />)}
                </AnimatePresence>
              </motion.div>
            )}

            {visible < filtered.length && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full glass px-7 py-3.5 text-sm text-ivory/80 hover:text-mist-bright hover:border-mist-bright/40 transition-colors">
                  Load more ({filtered.length - visible} left)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter / Sort bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-matte/90 backdrop-blur-md border-t border-white/8 grid grid-cols-2">
        <button onClick={() => setSortOpen(true)} className="flex items-center justify-center gap-2 py-4 text-sm text-ivory/85 border-r border-white/8">
          <HiArrowsUpDown size={16} /> Sort
        </button>
        <button onClick={() => setFilterOpen(true)} className="relative flex items-center justify-center gap-2 py-4 text-sm text-ivory/85">
          <HiAdjustmentsHorizontal size={16} /> Filter
          {activeCount > 0 && (
            <span className="absolute top-2.5 right-6 w-4.5 h-4.5 min-w-[1.1rem] px-1 rounded-full bg-mist-bright text-matte text-[0.6rem] font-medium flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <MobileFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} resultCount={filtered.length} title="Filters">
        {controls}
      </MobileFilterSheet>

      <MobileFilterSheet open={sortOpen} onClose={() => setSortOpen(false)} resultCount={filtered.length} title="Sort by">
        <div className="flex flex-col">
          {SORT_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => { setSort(o.id); setSortOpen(false); }}
              className={`flex items-center justify-between py-3.5 border-b border-white/8 text-left text-sm ${sort === o.id ? 'text-mist-bright' : 'text-ivory/75'}`}>
              {o.label}
              {sort === o.id && <span className="w-2 h-2 rounded-full bg-mist-bright" />}
            </button>
          ))}
        </div>
      </MobileFilterSheet>
    </main>
  );
}

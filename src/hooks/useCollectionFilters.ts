import { useMemo, useState, useCallback, useEffect } from 'react';
import type { Product, FilterState, FacetKey, SortId, FacetDef } from '@/types/product';
import { FACET_DEFS } from '@/types/product';

export interface FacetOption {
  value: string;
  count: number;
}
export interface AvailableFacet extends FacetDef {
  options: FacetOption[];
}

export interface InitialFilters {
  facets?: Partial<Record<FacetKey, string[]>>;
  sort?: SortId;
  query?: string;
}

function optionsFor(products: Product[], def: FacetDef): FacetOption[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    const raw = p[def.key];
    if (raw == null) continue;
    const vals = def.multiValue && Array.isArray(raw) ? raw.map(String) : [String(raw)];
    for (const v of vals) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

/**
 * Client-side filtering, search and sorting for a collection. Derives the
 * facets that make sense for THIS category (with per-option counts, like a
 * proper storefront), and can be seeded from URL params for deep links.
 */
export function useCollectionFilters(products: Product[], initial?: InitialFilters) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    facets: initial?.facets ?? {},
    price: null,
    query: initial?.query ?? '',
  }));
  const [sort, setSort] = useState<SortId>(initial?.sort ?? 'featured');

  // Re-seed if the incoming initial changes (e.g., navigating with new params).
  useEffect(() => {
    setFilters({ facets: initial?.facets ?? {}, price: null, query: initial?.query ?? '' });
    setSort(initial?.sort ?? 'featured');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableFacets = useMemo<AvailableFacet[]>(() => {
    return FACET_DEFS.map((def) => ({ ...def, options: optionsFor(products, def) })).filter(
      (f) => f.options.length >= 2
    );
  }, [products]);

  const priceBounds = useMemo<[number, number] | null>(() => {
    const priced = products.map((p) => p.price).filter((n): n is number => typeof n === 'number');
    if (!priced.length) return null;
    return [Math.min(...priced), Math.max(...priced)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const result = products.filter((p) => {
      for (const [key, selected] of Object.entries(filters.facets) as [FacetKey, string[]][]) {
        if (!selected?.length) continue;
        const raw = p[key];
        if (raw == null) return false;
        const has = Array.isArray(raw)
          ? raw.some((v) => selected.includes(String(v)))
          : selected.includes(String(raw));
        if (!has) return false;
      }
      if (filters.price && typeof p.price === 'number') {
        if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      }
      if (q) {
        const hay = [p.name, p.frameShape, p.frameMaterial, p.color, ...(p.tags ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const byPrice = (a: Product, b: Product) =>
      (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
    const sorted = [...result];
    switch (sort) {
      case 'price-asc': sorted.sort(byPrice); break;
      case 'price-desc': sorted.sort((a, b) => byPrice(b, a)); break;
      case 'newest': sorted.sort((a, b) => Number(b.tags?.includes('new')) - Number(a.tags?.includes('new'))); break;
      case 'popular': sorted.sort((a, b) => Number(b.tags?.includes('bestseller')) - Number(a.tags?.includes('bestseller'))); break;
      default: sorted.sort((a, b) => Number(b.featured) - Number(a.featured)); break;
    }
    return sorted;
  }, [products, filters, sort]);

  const toggleFacet = useCallback((key: FacetKey, value: string) => {
    setFilters((prev) => {
      const current = prev.facets[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      const facets = { ...prev.facets };
      if (next.length) facets[key] = next;
      else delete facets[key];
      return { ...prev, facets };
    });
  }, []);

  const removeFacet = useCallback((key: FacetKey, value: string) => {
    setFilters((prev) => {
      const next = (prev.facets[key] ?? []).filter((v) => v !== value);
      const facets = { ...prev.facets };
      if (next.length) facets[key] = next;
      else delete facets[key];
      return { ...prev, facets };
    });
  }, []);

  const setPrice = useCallback((price: [number, number] | null) => {
    setFilters((prev) => ({ ...prev, price }));
  }, []);
  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);
  const reset = useCallback(() => setFilters({ facets: {}, price: null, query: '' }), []);

  const activeCount = useMemo(() => {
    let n = Object.values(filters.facets).reduce((acc, v) => acc + (v?.length ?? 0), 0);
    if (filters.price) n += 1;
    if (filters.query.trim()) n += 1;
    return n;
  }, [filters]);

  return {
    filters, sort, setSort, availableFacets, priceBounds, filtered,
    toggleFacet, removeFacet, setPrice, setQuery, reset, activeCount,
  };
}

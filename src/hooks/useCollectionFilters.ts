import { useMemo, useState, useCallback } from 'react';
import type {
  Product,
  FilterState,
  FacetKey,
  SortId,
  FacetDef,
} from '@/types/product';
import { FACET_DEFS } from '@/types/product';

export interface AvailableFacet extends FacetDef {
  values: string[];
}

function valuesFor(products: Product[], def: FacetDef): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const raw = p[def.key];
    if (raw == null) continue;
    if (def.multiValue && Array.isArray(raw)) raw.forEach((v) => set.add(String(v)));
    else if (!Array.isArray(raw)) set.add(String(raw));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

const EMPTY: FilterState = { facets: {}, price: null, query: '' };

/**
 * Derives the facets that actually make sense for THIS set of products (so a
 * contact-lens collection never shows a "Frame Shape" filter), then applies
 * client-side filtering, text search and sorting. No backend involved.
 */
export function useCollectionFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [sort, setSort] = useState<SortId>('featured');

  // Which facets have ≥2 distinct values in this category.
  const availableFacets = useMemo<AvailableFacet[]>(() => {
    return FACET_DEFS.map((def) => ({ ...def, values: valuesFor(products, def) })).filter(
      (f) => f.values.length >= 2
    );
  }, [products]);

  // Price bounds for the range slider (only when priced products exist).
  const priceBounds = useMemo<[number, number] | null>(() => {
    const priced = products.map((p) => p.price).filter((n): n is number => typeof n === 'number');
    if (!priced.length) return null;
    return [Math.min(...priced), Math.max(...priced)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const result = products.filter((p) => {
      // Facet matching — a product must satisfy every active facet group.
      for (const [key, selected] of Object.entries(filters.facets) as [FacetKey, string[]][]) {
        if (!selected?.length) continue;
        const raw = p[key];
        if (raw == null) return false;
        const has = Array.isArray(raw)
          ? raw.some((v) => selected.includes(String(v)))
          : selected.includes(String(raw));
        if (!has) return false;
      }

      // Price range.
      if (filters.price && typeof p.price === 'number') {
        if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      }

      // Text search across name, shape, material, colour, tags.
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
      case 'price-asc':
        sorted.sort(byPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => byPrice(b, a));
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.tags?.includes('new')) - Number(a.tags?.includes('new')));
        break;
      case 'popular':
        sorted.sort(
          (a, b) => Number(b.tags?.includes('bestseller')) - Number(a.tags?.includes('bestseller'))
        );
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }
    return sorted;
  }, [products, filters, sort]);

  // ---- mutators -----------------------------------------------------------
  const toggleFacet = useCallback((key: FacetKey, value: string) => {
    setFilters((prev) => {
      const current = prev.facets[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
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

  const reset = useCallback(() => setFilters(EMPTY), []);

  const activeCount = useMemo(() => {
    let n = Object.values(filters.facets).reduce((acc, v) => acc + (v?.length ?? 0), 0);
    if (filters.price) n += 1;
    if (filters.query.trim()) n += 1;
    return n;
  }, [filters]);

  return {
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
  };
}

// =========================================================================
// Product model for the collection experience.
// All product DATA lives in src/data/products.ts — nothing is hardcoded in UI.
// =========================================================================

/** Category ids mirror the existing PRODUCT_CATEGORIES in constants/business.ts. */
export type CategoryId =
  | 'sunglasses'
  | 'prescription'
  | 'bluecut'
  | 'kids'
  | 'office'
  | 'contact-lens'
  | 'smart-glasses';

export type Availability = 'in-stock' | 'made-to-order' | 'limited';

export interface Product {
  /** Human-readable SKU, e.g. "BO-SUN-001" — also shown in the WhatsApp enquiry. */
  id: string;
  name: string;
  /** URL slug within a collection, e.g. "meridian-aviator". */
  slug: string;
  category: CategoryId;
  description: string;
  /** First image is the primary; the rest are additional views. */
  images: string[];
  /** In INR. Undefined = "price on enquiry". */
  price?: number;
  frameShape?: string;
  frameMaterial?: string;
  color?: string;
  /** Lens options this frame is compatible with. */
  lensType?: string[];
  gender?: 'Men' | 'Women' | 'Unisex' | 'Kids';
  featured?: boolean;
  tags?: string[];
  availability?: Availability;
}

// ---- Filtering & sorting --------------------------------------------------

export type SortId =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'popular';

export interface SortOption {
  id: SortId;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

/** Which product field a facet reads from. */
export type FacetKey =
  | 'frameShape'
  | 'gender'
  | 'frameMaterial'
  | 'color'
  | 'lensType'
  | 'tags'
  | 'availability';

export interface FacetDef {
  key: FacetKey;
  label: string;
  /** lensType/tags are arrays on the product; the rest are scalar. */
  multiValue?: boolean;
}

/** Every facet we *could* show. The collection page only renders the ones
    that actually have options in the current category's data. */
export const FACET_DEFS: FacetDef[] = [
  { key: 'frameShape', label: 'Frame Shape' },
  { key: 'gender', label: 'Style' },
  { key: 'frameMaterial', label: 'Material' },
  { key: 'color', label: 'Colour' },
  { key: 'lensType', label: 'Lens Type', multiValue: true },
  { key: 'tags', label: 'Collection', multiValue: true },
  { key: 'availability', label: 'Availability' },
];

/** Selected facet values, keyed by facet. Plus a price range + text query. */
export interface FilterState {
  facets: Partial<Record<FacetKey, string[]>>;
  price: [number, number] | null;
  query: string;
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  'in-stock': 'In stock',
  'made-to-order': 'Made to order',
  limited: 'Limited edition',
};

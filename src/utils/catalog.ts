import type { CategoryId } from '@/types/product';
import { getProductsByCategory } from '@/data/products';

/** Approximate hex for a colour name, for rendering little swatch dots. */
const COLOR_HEX: Record<string, string> = {
  'Matte Black': '#1b1b1d', 'Jet Black': '#0b0b0d', Black: '#141416',
  Gunmetal: '#53565a', 'Dark Gunmetal': '#3a3d40', Carbon: '#26292c',
  Gold: '#c9a34e', 'Black Gold': '#2a2620', 'Rose Gold': '#d8a7a1',
  Champagne: '#e6d5a8', Silver: '#c8cccf', 'Brushed Silver': '#b7bcc0',
  Tortoise: '#6b4423', Havana: '#7a4a1e', Amber: '#c47b2e', Espresso: '#3b2a20',
  Smoke: '#5a5a5a', Charcoal: '#2b2e33', Slate: '#4a5259', Grey: '#8a8f94',
  Navy: '#1f2a44', Teal: '#1f6f6f', 'Sky Blue': '#7fb4d8', Crystal: '#dfe6ea', Clear: '#e8eef2',
  Red: '#b3352e', Pink: '#e29ab0', Lavender: '#b7a6d1', Green: '#3f7d4f',
  Orange: '#d1863b', Yellow: '#d9b641', Hazel: '#8e6b3f',
};

export function colorHex(name?: string): string {
  if (!name) return '#8FB0C4';
  return COLOR_HEX[name.trim()] ?? '#8FB0C4';
}

export interface MegaGroup {
  label: string;
  /** query key used on the collection page, e.g. "shape" → ?shape=Aviator */
  param: string;
  items: string[];
}

/** Distinct values of a field within a category, for building mega-menus. */
function distinct(category: CategoryId, pick: (p: ReturnType<typeof getProductsByCategory>[number]) => string | string[] | undefined): string[] {
  const set = new Set<string>();
  for (const p of getProductsByCategory(category)) {
    const v = pick(p);
    if (Array.isArray(v)) v.forEach((x) => set.add(x));
    else if (v) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** The dropdown columns shown for a category in the navbar mega-menu. */
export function megaGroupsFor(category: CategoryId): MegaGroup[] {
  const groups: MegaGroup[] = [];
  const shapes = distinct(category, (p) => p.frameShape);
  const styles = distinct(category, (p) => p.gender);
  const lenses = distinct(category, (p) => p.lensType);

  if (shapes.length >= 2) groups.push({ label: 'Shop by Shape', param: 'shape', items: shapes.slice(0, 6) });
  if (styles.length >= 2) groups.push({ label: 'Shop by Style', param: 'style', items: styles });
  if (shapes.length < 2 && lenses.length >= 2) {
    groups.push({ label: 'Lens Type', param: 'lens', items: lenses.slice(0, 6) });
  }
  groups.push({ label: 'Collections', param: 'collection', items: ['premium', 'bestseller', 'new'] });
  return groups;
}

/** Pretty label for a collection tag. */
export function tagLabel(tag: string): string {
  return tag === 'premium' ? 'Premium'
    : tag === 'bestseller' ? 'Bestsellers'
    : tag === 'new' ? 'New Arrivals'
    : tag.charAt(0).toUpperCase() + tag.slice(1);
}

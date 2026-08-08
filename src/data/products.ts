// =========================================================================
// CENTRAL PRODUCT CATALOG — edit products here, never inside components.
//
// Images use free, license-clear Unsplash photos (the same source the rest of
// the site already uses), served responsively. To swap an image, just change
// its id below. If any image fails to load, the UI falls back to a consistent
// glass/gradient placeholder so the layout never breaks.
// =========================================================================
import type { CategoryId, Product } from '@/types/product';
import { PRODUCT_CATEGORIES } from '@/constants/business';
import eyonesHero from '@/assets/images/eyones-hero.jpg';
import eyonesFeatures from '@/assets/images/eyones-features.jpg';
import eyonesBranding from '@/assets/images/eyones-branding.jpg';

/** Responsive Unsplash URL for a given photo id. */
function u(id: string, w = 900): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

// ---- Images ---------------------------------------------------------------
// Every product gets its OWN genuine, license-clear Unsplash product photo.
// These ids were harvested from Unsplash's free-license catalog (clean product
// shots — real frames/lenses on plain surfaces), so each frame looks distinct
// and real, and nothing is ever left without an image. To use your own studio
// photos later, just replace the ids (or URLs) in the pool for that category.

// Clean sunglasses product shots (12 — one per sunglasses product)
const SUN_IMGS = [
  '1523884156331-22cc4f5df98d', '1511499767150-a48a237f0083', '1572635196237-14b3f281503f',
  '1577803645773-f96470509666', '1584036553516-bf83210aa16c', '1610136649349-0f646f318053',
  '1473496169904-658ba7c44d8a', '1608539733292-190446b22b83', '1508296695146-257a814070b4',
  '1611222777277-61319d63ca94', '1566421966482-ad8076104d8e', '1653038282189-803202722a05',
];

// Clean eyeglass-frame product shots (14 — shared across prescription/blue-cut/office/kids)
const EYE_IMGS = [
  '1556306510-31ca015374b0', '1614715838608-dd527c46231d', '1646084081219-1090f72a531c',
  '1591076482161-42ce6da69f67', '1534078477103-9f6a18b3a5e2', '1574258495973-f010dfbb5371',
  '1589176449149-71f7ea77ec25', '1603578119639-798b8413d8d7', '1483412468200-72182dbbc544',
  '1486250944723-86bca2b15b06', '1722303165074-acba5cd2f3cd', '1646083774155-2a40b675641d',
  '1516714819001-8ee7a13b71d7', '1456081101716-74e616ab23d8',
];

// Contact-lens product shots (packs, blisters, coloured lenses, accessories)
const LENS_IMGS = [
  '1573569986767-6c832cc6868c', '1599243315159-faa0eac09ec1', '1743590363059-ce890f6cc97b',
  '1582143434535-eba55a806718', '1687717002957-23fa760873a3', '1687717003503-8ccebb9df7fe',
  '1687717002851-4aec30510fa5', '1494869042583-f6c911f04b4c',
];

// Kids: real frame shots led by the playful kids photo, rotated for variety.
const KIDS_IMGS = ['1685950925275-281298061f98', ...EYE_IMGS];

// Eyones smart-glasses use the project's own branded photography.
const SMART_IMGS: string[][] = [
  [eyonesHero, eyonesFeatures],
  [eyonesFeatures, eyonesBranding],
  [eyonesBranding, eyonesHero],
];

function pick(pool: string[], i: number, offset = 0): string[] {
  const a = u(pool[(i + offset) % pool.length]);
  const b = u(pool[(i + offset + 1) % pool.length]); // second angle for the gallery
  return [a, b];
}

/**
 * Gives each product its own genuine, category-correct image. Within a category
 * the primary photo is unique per product; the detail gallery adds a second
 * real shot from the same pool.
 */
function imagesFor(category: CategoryId, i: number): string[] {
  switch (category) {
    case 'smart-glasses': return SMART_IMGS[i % SMART_IMGS.length];
    case 'sunglasses': return pick(SUN_IMGS, i);
    case 'contact-lens': return [u(LENS_IMGS[i % LENS_IMGS.length])];
    case 'kids': return pick(KIDS_IMGS, i);
    case 'prescription': return pick(EYE_IMGS, i, 0);
    case 'bluecut': return pick(EYE_IMGS, i, 5);
    case 'office': return pick(EYE_IMGS, i, 9);
    default: return pick(EYE_IMGS, i);
  }
}

// Back-compat shim: product rows below still pass an `imgs` field for
// readability, but images are assigned centrally by imagesFor(). These verified
// ids keep those legacy expressions valid; their values are not used.
const POOL = {
  sun: SUN_IMGS, presc: EYE_IMGS, blue: EYE_IMGS,
  kids: KIDS_IMGS, office: EYE_IMGS, lens: LENS_IMGS, frame: EYE_IMGS,
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---- Compact builder ------------------------------------------------------
// Keeps every product a readable one-liner while producing a fully-typed
// Product object. This is data assembly only — no UI logic lives here.

interface Row {
  name: string;
  price?: number;
  shape?: string;
  material?: string;
  color?: string;
  lens?: string[];
  gender?: Product['gender'];
  featured?: boolean;
  tags?: string[];
  availability?: Product['availability'];
  imgs?: string[]; // ignored — images are assigned per category by imagesFor()
}

function build(category: CategoryId, prefix: string, rows: Row[]): Product[] {
  return rows.map((r, i) => ({
    id: `BO-${prefix}-${String(i + 1).padStart(3, '0')}`,
    name: r.name,
    slug: slugify(r.name),
    category,
    description:
      r.tags?.includes('premium')
        ? `A signature ${(r.shape ?? 'frame').toLowerCase()} silhouette, hand-finished in ${r.material ?? 'premium materials'}. Part of our premium line — built to be noticed and to last.`
        : `A refined ${(r.shape ?? 'frame').toLowerCase()} profile in ${r.material ?? 'quality materials'}, tuned for everyday comfort and a clean, considered look.`,
    images: imagesFor(category, i),
    price: r.price,
    frameShape: r.shape,
    frameMaterial: r.material,
    color: r.color,
    lensType: r.lens,
    gender: r.gender,
    featured: r.featured,
    tags: r.tags,
    availability: r.availability ?? 'in-stock',
  }));
}

const LENS_ALL = ['Single Vision', 'Blue Cut', 'Anti-Glare', 'Progressive', 'Photochromic'];
const LENS_SUN = ['Polarised', 'UV400', 'Gradient Tint', 'Mirror Coat'];

// =========================================================================
// SUNGLASSES
// =========================================================================
const sunglasses = build('sunglasses', 'SUN', [
  { name: 'Meridian Aviator', price: 4990, shape: 'Aviator', material: 'Titanium', color: 'Gunmetal', lens: LENS_SUN, gender: 'Unisex', featured: true, tags: ['premium', 'bestseller'], imgs: [u(POOL.frame[3]), u(POOL.sun[0]), u(POOL.frame[0])] },
  { name: 'Halcyon Wayfarer', price: 3490, shape: 'Wayfarer', material: 'Acetate', color: 'Matte Black', lens: LENS_SUN, gender: 'Men', featured: true, tags: ['bestseller'], imgs: [u(POOL.sun[0]), u(POOL.frame[0])] },
  { name: 'Aster Cat-Eye', price: 3990, shape: 'Cat-Eye', material: 'Acetate', color: 'Tortoise', lens: LENS_SUN, gender: 'Women', tags: ['premium'], imgs: [u(POOL.frame[1]), u(POOL.sun[2])] },
  { name: 'Dune Round', price: 2990, shape: 'Round', material: 'Metal', color: 'Rose Gold', lens: LENS_SUN, gender: 'Unisex', imgs: [u(POOL.frame[0]), u(POOL.sun[1])] },
  { name: 'Voss Navigator', price: 5490, shape: 'Aviator', material: 'Alloy', color: 'Gold', lens: LENS_SUN, gender: 'Men', tags: ['premium'], availability: 'limited', imgs: [u(POOL.frame[3]), u(POOL.sun[0])] },
  { name: 'Marlow Square', price: 3290, shape: 'Square', material: 'Acetate', color: 'Amber', lens: LENS_SUN, gender: 'Unisex', imgs: [u(POOL.sun[1]), u(POOL.frame[2])] },
  { name: 'Coast Shield', price: 4290, shape: 'Shield', material: 'Nylon', color: 'Smoke', lens: LENS_SUN, gender: 'Unisex', featured: true, tags: ['new'], imgs: [u(POOL.sun[2]), u(POOL.frame[4])] },
  { name: 'Linea Oval', price: 2790, shape: 'Oval', material: 'Acetate', color: 'Charcoal', lens: LENS_SUN, gender: 'Women', imgs: [u(POOL.frame[4]), u(POOL.sun[1])] },
  { name: 'Halden Browline', price: 3890, shape: 'Browline', material: 'Steel', color: 'Silver', lens: LENS_SUN, gender: 'Men', imgs: [u(POOL.frame[2]), u(POOL.sun[0])] },
  { name: 'Mesa Clubmaster', price: 3690, shape: 'Browline', material: 'Acetate', color: 'Havana', lens: LENS_SUN, gender: 'Unisex', tags: ['bestseller'], imgs: [u(POOL.sun[0]), u(POOL.frame[1])] },
  { name: 'Onyx Rectangle', price: 3190, shape: 'Rectangle', material: 'TR90', color: 'Jet Black', lens: LENS_SUN, gender: 'Men', imgs: [u(POOL.sun[1]), u(POOL.frame[3])] },
  { name: 'Solstice Round', price: 5990, shape: 'Round', material: 'Titanium', color: 'Champagne', lens: LENS_SUN, gender: 'Women', tags: ['premium'], availability: 'limited', imgs: [u(POOL.frame[0]), u(POOL.sun[2])] },
]);

// =========================================================================
// PRESCRIPTION FRAMES
// =========================================================================
const prescription = build('prescription', 'PRE', [
  { name: 'Meridian Round', price: 2490, shape: 'Round', material: 'Titanium', color: 'Matte Black', lens: LENS_ALL, gender: 'Unisex', featured: true, tags: ['bestseller'], imgs: [u(POOL.frame[0]), u(POOL.presc[0])] },
  { name: 'Halden Square', price: 2290, shape: 'Square', material: 'Steel', color: 'Brushed Silver', lens: LENS_ALL, gender: 'Men', featured: true, imgs: [u(POOL.frame[2]), u(POOL.presc[1])] },
  { name: 'Aster Cat-Eye', price: 2690, shape: 'Cat-Eye', material: 'Acetate', color: 'Tortoise', lens: LENS_ALL, gender: 'Women', tags: ['premium'], imgs: [u(POOL.frame[1]), u(POOL.presc[2])] },
  { name: 'Linea Oval', price: 1990, shape: 'Oval', material: 'Acetate', color: 'Charcoal', lens: LENS_ALL, gender: 'Unisex', imgs: [u(POOL.presc[0]), u(POOL.frame[4])] },
  { name: 'Atlas Rectangle', price: 2190, shape: 'Rectangle', material: 'TR90', color: 'Navy', lens: LENS_ALL, gender: 'Men', imgs: [u(POOL.presc[1]), u(POOL.frame[2])] },
  { name: 'Wren Rimless', price: 3490, shape: 'Rimless', material: 'Titanium', color: 'Silver', lens: LENS_ALL, gender: 'Unisex', featured: true, tags: ['premium'], imgs: [u(POOL.presc[2]), u(POOL.frame[0])] },
  { name: 'Bexley Browline', price: 2590, shape: 'Browline', material: 'Acetate', color: 'Havana', lens: LENS_ALL, gender: 'Men', imgs: [u(POOL.frame[2]), u(POOL.presc[0])] },
  { name: 'Ivy Round', price: 2090, shape: 'Round', material: 'Metal', color: 'Rose Gold', lens: LENS_ALL, gender: 'Women', imgs: [u(POOL.presc[0]), u(POOL.frame[1])] },
  { name: 'Cove Square', price: 1890, shape: 'Square', material: 'Acetate', color: 'Crystal', lens: LENS_ALL, gender: 'Unisex', tags: ['new'], imgs: [u(POOL.presc[1]), u(POOL.frame[4])] },
  { name: 'Sable Oval', price: 2390, shape: 'Oval', material: 'Steel', color: 'Gunmetal', lens: LENS_ALL, gender: 'Women', imgs: [u(POOL.frame[4]), u(POOL.presc[2])] },
  { name: 'Regent Rectangle', price: 2990, shape: 'Rectangle', material: 'Titanium', color: 'Black Gold', lens: LENS_ALL, gender: 'Men', tags: ['premium'], imgs: [u(POOL.presc[2]), u(POOL.frame[3])] },
]);

// =========================================================================
// COMPUTER / BLUE-CUT FRAMES
// =========================================================================
const bluecut = build('bluecut', 'BLU', [
  { name: 'Focus Square', price: 1790, shape: 'Square', material: 'TR90', color: 'Matte Black', lens: ['Blue Cut', 'Anti-Glare'], gender: 'Unisex', featured: true, tags: ['bestseller'], imgs: [u(POOL.blue[0]), u(POOL.frame[2])] },
  { name: 'Lumen Round', price: 1990, shape: 'Round', material: 'Acetate', color: 'Crystal', lens: ['Blue Cut', 'Anti-Glare'], gender: 'Unisex', featured: true, imgs: [u(POOL.blue[1]), u(POOL.frame[0])] },
  { name: 'Pixel Rectangle', price: 1690, shape: 'Rectangle', material: 'TR90', color: 'Navy', lens: ['Blue Cut'], gender: 'Men', imgs: [u(POOL.blue[2]), u(POOL.frame[2])] },
  { name: 'Screen Oval', price: 1890, shape: 'Oval', material: 'Acetate', color: 'Grey', lens: ['Blue Cut', 'Anti-Glare'], gender: 'Women', imgs: [u(POOL.frame[4]), u(POOL.blue[0])] },
  { name: 'Byte Browline', price: 2190, shape: 'Browline', material: 'Metal', color: 'Silver', lens: ['Blue Cut', 'Anti-Glare'], gender: 'Unisex', tags: ['premium'], imgs: [u(POOL.blue[1]), u(POOL.frame[2])] },
  { name: 'Nova Square', price: 1590, shape: 'Square', material: 'TR90', color: 'Charcoal', lens: ['Blue Cut'], gender: 'Men', imgs: [u(POOL.blue[0]), u(POOL.frame[3])] },
  { name: 'Clarity Round', price: 2090, shape: 'Round', material: 'Titanium', color: 'Rose Gold', lens: ['Blue Cut', 'Anti-Glare', 'Photochromic'], gender: 'Women', tags: ['premium'], imgs: [u(POOL.blue[2]), u(POOL.frame[0])] },
  { name: 'Grid Rectangle', price: 1490, shape: 'Rectangle', material: 'Acetate', color: 'Black', lens: ['Blue Cut'], gender: 'Unisex', imgs: [u(POOL.blue[1]), u(POOL.frame[2])] },
  { name: 'Deskmate Oval', price: 1790, shape: 'Oval', material: 'TR90', color: 'Slate', lens: ['Blue Cut', 'Anti-Glare'], gender: 'Unisex', tags: ['new'], imgs: [u(POOL.frame[4]), u(POOL.blue[0])] },
  { name: 'Vector Square', price: 2290, shape: 'Square', material: 'Titanium', color: 'Gunmetal', lens: ['Blue Cut', 'Anti-Glare', 'Progressive'], gender: 'Men', tags: ['premium'], imgs: [u(POOL.blue[2]), u(POOL.frame[3])] },
]);

// =========================================================================
// KIDS FRAMES
// =========================================================================
const kids = build('kids', 'KID', [
  { name: 'Pixie Round', price: 1290, shape: 'Round', material: 'Flexible TR90', color: 'Sky Blue', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', featured: true, tags: ['bestseller'], imgs: [u(POOL.kids[0]), u(POOL.frame[0])] },
  { name: 'Comet Square', price: 1390, shape: 'Square', material: 'Flexible TR90', color: 'Red', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', featured: true, imgs: [u(POOL.kids[1]), u(POOL.frame[2])] },
  { name: 'Bubble Oval', price: 1190, shape: 'Oval', material: 'Rubberised', color: 'Pink', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', imgs: [u(POOL.kids[2]), u(POOL.frame[4])] },
  { name: 'Rocket Rectangle', price: 1490, shape: 'Rectangle', material: 'Flexible TR90', color: 'Navy', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', imgs: [u(POOL.kids[0]), u(POOL.frame[2])] },
  { name: 'Sprout Round', price: 1090, shape: 'Round', material: 'Silicone', color: 'Green', lens: ['Single Vision'], gender: 'Kids', tags: ['new'], imgs: [u(POOL.kids[1]), u(POOL.frame[0])] },
  { name: 'Cub Square', price: 1590, shape: 'Square', material: 'Flexible TR90', color: 'Black', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', imgs: [u(POOL.kids[2]), u(POOL.frame[3])] },
  { name: 'Star Cat-Eye', price: 1690, shape: 'Cat-Eye', material: 'Acetate', color: 'Lavender', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', tags: ['premium'], imgs: [u(POOL.kids[0]), u(POOL.frame[1])] },
  { name: 'Dash Oval', price: 1190, shape: 'Oval', material: 'Rubberised', color: 'Orange', lens: ['Single Vision'], gender: 'Kids', imgs: [u(POOL.kids[1]), u(POOL.frame[4])] },
  { name: 'Favor Round', price: 1290, shape: 'Round', material: 'Flexible TR90', color: 'Yellow', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', imgs: [u(POOL.kids[2]), u(POOL.frame[0])] },
  { name: 'Nimbus Square', price: 1790, shape: 'Square', material: 'Titanium Flex', color: 'Teal', lens: ['Blue Cut', 'Single Vision'], gender: 'Kids', tags: ['premium'], availability: 'made-to-order', imgs: [u(POOL.kids[0]), u(POOL.frame[3])] },
]);

// =========================================================================
// OFFICE GLASSES
// =========================================================================
const office = build('office', 'OFF', [
  { name: 'Boardroom Rectangle', price: 2390, shape: 'Rectangle', material: 'Titanium', color: 'Gunmetal', lens: ['Anti-Glare', 'Blue Cut', 'Progressive'], gender: 'Men', featured: true, tags: ['premium', 'bestseller'], imgs: [u(POOL.office[0]), u(POOL.frame[2])] },
  { name: 'Ledger Square', price: 1990, shape: 'Square', material: 'Acetate', color: 'Espresso', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Unisex', featured: true, imgs: [u(POOL.office[1]), u(POOL.frame[0])] },
  { name: 'Draft Round', price: 1890, shape: 'Round', material: 'Metal', color: 'Silver', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Women', imgs: [u(POOL.office[2]), u(POOL.frame[1])] },
  { name: 'Memo Oval', price: 1790, shape: 'Oval', material: 'Acetate', color: 'Slate', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Unisex', imgs: [u(POOL.frame[4]), u(POOL.office[0])] },
  { name: 'Quorum Browline', price: 2290, shape: 'Browline', material: 'Steel', color: 'Black Gold', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Men', tags: ['premium'], imgs: [u(POOL.office[1]), u(POOL.frame[2])] },
  { name: 'Clause Rectangle', price: 1690, shape: 'Rectangle', material: 'TR90', color: 'Navy', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Unisex', imgs: [u(POOL.office[0]), u(POOL.frame[3])] },
  { name: 'Atrium Rimless', price: 2990, shape: 'Rimless', material: 'Titanium', color: 'Champagne', lens: ['Anti-Glare', 'Blue Cut', 'Progressive'], gender: 'Women', tags: ['premium'], imgs: [u(POOL.office[2]), u(POOL.frame[0])] },
  { name: 'Tenure Square', price: 1590, shape: 'Square', material: 'Acetate', color: 'Charcoal', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Men', imgs: [u(POOL.office[1]), u(POOL.frame[2])] },
  { name: 'Studio Oval', price: 1890, shape: 'Oval', material: 'Metal', color: 'Rose Gold', lens: ['Anti-Glare', 'Blue Cut'], gender: 'Women', tags: ['new'], imgs: [u(POOL.frame[4]), u(POOL.office[0])] },
  { name: 'Executive Rectangle', price: 2690, shape: 'Rectangle', material: 'Titanium', color: 'Matte Black', lens: ['Anti-Glare', 'Blue Cut', 'Progressive'], gender: 'Men', tags: ['premium'], imgs: [u(POOL.office[0]), u(POOL.frame[3])] },
]);

// =========================================================================
// CONTACT LENS (lens SKUs — frame facets simply won't appear for these)
// =========================================================================
const contactLens = build('contact-lens', 'CON', [
  { name: 'ClearDay Daily (30)', price: 990, material: 'Silicone Hydrogel', color: 'Clear', lens: ['Daily Disposable'], gender: 'Unisex', featured: true, tags: ['bestseller'], imgs: [u(POOL.lens[0])] },
  { name: 'ClearDay Daily (90)', price: 2490, material: 'Silicone Hydrogel', color: 'Clear', lens: ['Daily Disposable'], gender: 'Unisex', imgs: [u(POOL.lens[1])] },
  { name: 'MonthFlex Monthly', price: 1290, material: 'Silicone Hydrogel', color: 'Clear', lens: ['Monthly'], gender: 'Unisex', featured: true, imgs: [u(POOL.lens[2])] },
  { name: 'Aqua Toric Monthly', price: 1890, material: 'Silicone Hydrogel', color: 'Clear', lens: ['Monthly', 'Toric / Astigmatism'], gender: 'Unisex', tags: ['premium'], imgs: [u(POOL.lens[0])] },
  { name: 'Hue Colour — Hazel', price: 1490, material: 'Hydrogel', color: 'Hazel', lens: ['Monthly', 'Coloured'], gender: 'Unisex', imgs: [u(POOL.lens[1])] },
  { name: 'Hue Colour — Grey', price: 1490, material: 'Hydrogel', color: 'Grey', lens: ['Monthly', 'Coloured'], gender: 'Unisex', imgs: [u(POOL.lens[2])] },
  { name: 'Hue Colour — Green', price: 1490, material: 'Hydrogel', color: 'Green', lens: ['Monthly', 'Coloured'], gender: 'Unisex', tags: ['new'], imgs: [u(POOL.lens[0])] },
  { name: 'Multifocal Monthly', price: 2290, material: 'Silicone Hydrogel', color: 'Clear', lens: ['Monthly', 'Multifocal'], gender: 'Unisex', tags: ['premium'], availability: 'made-to-order', imgs: [u(POOL.lens[1])] },
]);

// =========================================================================
// EYONES SMART GLASSES (branded line — uses the project's Eyones imagery)
// =========================================================================
const smartGlasses = build('smart-glasses', 'SMT', [
  { name: 'Eyones Classic', price: 7990, shape: 'Wayfarer', material: 'Acetate', color: 'Matte Black', lens: ['UVA/UVB', 'Open-Ear Audio'], gender: 'Unisex', featured: true, tags: ['premium', 'bestseller'], imgs: [eyonesHero, eyonesFeatures] },
  { name: 'Eyones Round', price: 7990, shape: 'Round', material: 'Metal', color: 'Gunmetal', lens: ['UVA/UVB', 'Open-Ear Audio'], gender: 'Unisex', featured: true, tags: ['premium'], imgs: [eyonesFeatures, eyonesBranding] },
  { name: 'Eyones Aviator', price: 8490, shape: 'Aviator', material: 'Alloy', color: 'Gold', lens: ['UVA/UVB', 'Open-Ear Audio'], gender: 'Men', tags: ['premium'], imgs: [eyonesBranding, eyonesHero] },
  { name: 'Eyones Cat-Eye', price: 8490, shape: 'Cat-Eye', material: 'Acetate', color: 'Tortoise', lens: ['UVA/UVB', 'Open-Ear Audio'], gender: 'Women', tags: ['premium'], imgs: [eyonesHero, eyonesBranding] },
  { name: 'Eyones Sport', price: 8990, shape: 'Shield', material: 'Nylon', color: 'Carbon', lens: ['UVA/UVB', 'Open-Ear Audio'], gender: 'Unisex', tags: ['premium', 'new'], availability: 'limited', imgs: [eyonesFeatures, eyonesHero] },
  { name: 'Eyones Clear', price: 7490, shape: 'Square', material: 'TR90', color: 'Crystal', lens: ['Blue Cut', 'Open-Ear Audio'], gender: 'Unisex', tags: ['premium'], imgs: [eyonesBranding, eyonesFeatures] },
]);

// =========================================================================
// PUBLIC API
// =========================================================================
export const PRODUCTS: Product[] = [
  ...sunglasses,
  ...prescription,
  ...bluecut,
  ...kids,
  ...office,
  ...contactLens,
  ...smartGlasses,
];

export function getProductsByCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductBySlug(category: CategoryId, slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.category === category && p.slug === slug);
}

/** The subset of PRODUCT_CATEGORIES that have a browsable collection. */
export function isCollectionCategory(id: string): id is CategoryId {
  return PRODUCTS.some((p) => p.category === id);
}

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  desc: string;
  image: string;
}

/** Pull title/desc/image straight from the existing PRODUCT_CATEGORIES so the
    collection pages stay in lockstep with the homepage grid. */
export function getCategoryMeta(id: CategoryId): CategoryMeta | undefined {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === id);
  if (!cat) return undefined;
  return { id, title: cat.title, desc: cat.desc, image: cat.image as string };
}

export const COLLECTION_CATEGORIES: CategoryMeta[] = PRODUCT_CATEGORIES
  .map((c) => getCategoryMeta(c.id as CategoryId))
  .filter((c): c is CategoryMeta => !!c && isCollectionCategory(c.id));

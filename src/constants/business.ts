// =========================================================================
// EDIT EVERYTHING HERE. No text is hardcoded inside components.
// =========================================================================
import eyonesFeatures from '@/assets/images/eyones-features.jpg';

export const BUSINESS = {
  name: 'Bajaj Optics',
  tagline: 'See the World Differently',
  subtitle:
    'A premium optical studio for prescription eyewear, sunglasses and precision eye care — trusted across the city for over two decades.',
  city: 'Dewas, Madhya Pradesh',
  yearsOfTrust: 24,
  whatsappNumber: '919999999999', // country code + number, no + or spaces
  phoneNumber: '+91 99999 99999',
  email: 'hello@bajajoptics.in',
  instagramHandle: '@bajajoptics',
  instagramUrl: 'https://instagram.com/bajajoptics',
  address: 'Shop 12, Station Road, Dewas, Madhya Pradesh 455001',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117000!2d76.05!3d22.966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU4JzAwLjAiTiA3NsKwMDMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000',
  mapDirectionsUrl: 'https://maps.google.com/?q=Bajaj+Optics+Dewas',
  timings: [
    { day: 'Monday – Saturday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Sunday', hours: '11:00 AM – 6:00 PM' },
  ],
  googleRating: 4.9,
  googleReviewCount: 612,
} as const;

export const whatsappMessage = {
  general: `Hi ${BUSINESS.name}, I'd like to know more about your eyewear collection.`,
  eyeTest: `Hi ${BUSINESS.name}, I'd like to book a free eye test appointment.`,
  frame: (frameName: string) =>
    `Hi ${BUSINESS.name}, I'm interested in the "${frameName}" frame. Could you tell me more?`,
};

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Collection', href: '#collection' },
  { label: 'Frames', href: '#frames' },
  { label: 'Eye Test', href: '#eye-test' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#visit' },
];

export const WHY_US = [
  {
    title: 'Free Eye Test',
    desc: 'Comprehensive vision screening by certified optometrists, at no cost.',
  },
  {
    title: 'Latest Collection',
    desc: 'Curated frames updated every season, sourced from trusted makers.',
  },
  {
    title: 'Expert Guidance',
    desc: 'Personal frame and lens consultation matched to your face and lifestyle.',
  },
  {
    title: 'Premium Lenses',
    desc: 'Anti-glare, blue-cut and photochromic lens options built to last.',
  },
  {
    title: 'Honest Pricing',
    desc: 'Transparent, fair pricing with no hidden costs — ever.',
  },
  {
    title: '24 Years of Trust',
    desc: `Serving ${BUSINESS.city} families since 2001, one clear view at a time.`,
  },
] as const;

export const PRODUCT_CATEGORIES = [
   {
    id: 'smart-glasses',
    title: 'Eyones Smart Glasses',
    desc: 'Open-ear audio, touch control, UVA/UVB protection.',
    image: eyonesFeatures,
  },
  {
    id: 'prescription',
    title: 'Prescription Glasses',
    desc: 'Precision-crafted for everyday clarity.',
    image: 'https://images.unsplash.com/photo-1556306510-31ca015374b0?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'sunglasses',
    title: 'Sunglasses',
    desc: 'UV-protected, statement-ready shields.',
    image: 'https://images.unsplash.com/photo-1523884156331-22cc4f5df98d?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'bluecut',
    title: 'Blue-Cut Glasses',
    desc: 'Screen-safe lenses for long work days.',
    image: 'https://images.unsplash.com/photo-1746329545447-1312bd2f01ca?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'kids',
    title: 'Kids Collection',
    desc: 'Durable, playful frames built for motion.',
    image: 'https://images.unsplash.com/photo-1685950925275-281298061f98?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'contact-lens',
    title: 'Contact Lens',
    desc: 'Daily, monthly and colour lens options.',
    image: 'https://images.unsplash.com/photo-1573569986767-6c832cc6868c?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'office',
    title: 'Office Glasses',
    desc: 'Anti-glare comfort for the modern desk.',
    image: 'https://images.unsplash.com/photo-1758874383352-481f911951aa?w=900&q=80&auto=format&fit=crop',
  },
] as const;
export const FRAME_SHOWCASE = [
  { id: 'f1', name: 'Meridian Round', material: 'Titanium · Matte Black' },
  { id: 'f2', name: 'Aster Cat-Eye', material: 'Acetate · Tortoise' },
  { id: 'f3', name: 'Halden Square', material: 'Steel · Brushed Silver' },
  { id: 'f4', name: 'Voss Aviator', material: 'Alloy · Gunmetal' },
  { id: 'f5', name: 'Linea Oval', material: 'Acetate · Charcoal' },
] as const;

export const EYE_TEST_STEPS = [
  { step: '01', title: 'Book a Slot', desc: 'Reserve your preferred date and time online or on WhatsApp.' },
  { step: '02', title: 'Visit the Store', desc: 'Walk into our studio — no waiting rooms, no queues.' },
  { step: '03', title: 'Free Eye Test', desc: 'A thorough check-up from our certified optometrist.' },
  { step: '04', title: 'Choose Your Frame', desc: 'Get matched with frames suited to your face and needs.' },
  { step: '05', title: 'Done', desc: 'Walk out seeing clearly — most orders ready within days.' },
] as const;

export const REVIEWS = [
  { name: 'Ananya Sharma', rating: 5, text: 'The eye test was thorough and the staff helped me pick frames that actually suit my face. Best optical experience in the city.' },
  { name: 'Rohit Verma', rating: 5, text: 'Walked in for a quick check-up, walked out with glasses I love. Genuinely premium service without the premium markup.' },
  { name: 'Kavita Joshi', rating: 5, text: 'My kids love their new frames — sturdy and stylish. The team was patient with two very picky children.' },
  { name: 'Imran Khan', rating: 5, text: 'Booked my slot on WhatsApp, was seen within minutes. Modern, clean, and the optometrist clearly knew his craft.' },
  { name: 'Priya Nair', rating: 5, text: 'Been coming here for years. Consistent quality, honest advice, and they remember your prescription history.' },
] as const;

export const OWNER = {
  name: 'Rakesh Bajaj',
  role: 'Founder & Chief Optometrist',
  quote:
    'Every pair of glasses we hand over carries a promise — that you will see the world a little more clearly than you did yesterday.',
  bio: `Rakesh started Bajaj Optics in 2001 with a single chair and a single promise: honest eye care. Two decades later, that promise hasn't changed — only the number of families who trust it.`,
};

export const FACE_SHAPES = [
  {
    id: 'round',
    label: 'Round Face',
    desc: 'Soft curves, similar width and height.',
    recommends: ['Angular Rectangle', 'Bold Square', 'Geometric Wayfarer'],
  },
  {
    id: 'square',
    label: 'Square Face',
    desc: 'Strong jawline, broad forehead.',
    recommends: ['Round Metal', 'Soft Oval', 'Aviator'],
  },
  {
    id: 'oval',
    label: 'Oval Face',
    desc: 'Balanced proportions, gently tapered jaw.',
    recommends: ['Almost Any Frame', 'Cat-Eye', 'Square Acetate'],
  },
  {
    id: 'heart',
    label: 'Heart Face',
    desc: 'Wider forehead, narrow chin.',
    recommends: ['Light Rimless', 'Round Frames', 'Bottom-Heavy Acetate'],
  },
] as const;

export const LENS_TECHNOLOGY = [
  { id: 'bluecut', title: 'Blue Cut', desc: 'Filters harmful blue light from screens, reducing digital eye strain.' },
  { id: 'antiglare', title: 'Anti Glare', desc: 'Cuts reflections for sharper vision while driving at night.' },
  { id: 'uv', title: 'UV Protection', desc: 'Blocks 100% of UVA and UVB rays to protect long-term eye health.' },
  { id: 'scratch', title: 'Scratch Resistant', desc: 'A hardened coating that keeps lenses clear for years.' },
  { id: 'photochromic', title: 'Photochromic', desc: 'Automatically darkens in sunlight, clears indoors.' },
  { id: 'progressive', title: 'Progressive Lens', desc: 'Seamless near, intermediate and distance vision — no visible line.' },
] as const;

export const FAQS = [
  { q: 'Is the eye test really free?', a: 'Yes — every eye test at Bajaj Optics is completely free, with no obligation to purchase.' },
  { q: 'Do you offer a warranty on frames?', a: 'All frames come with a 1-year manufacturing warranty covering hinges and frame defects.' },
  { q: 'Can I get my lenses replaced without changing the frame?', a: 'Absolutely. Bring in your existing frame and we can fit new lenses to your updated prescription.' },
  { q: 'What if my frame breaks?', a: 'We offer in-store frame repair for most minor damage, often while you wait.' },
  { q: 'How long does delivery take?', a: 'Most prescription orders are ready within 3–5 business days; sunglasses and stock frames are same-day.' },
  { q: 'Do you accept insurance?', a: `We're happy to provide a detailed invoice for insurance reimbursement — ask our team for the paperwork you need.` },
] as const;

export const SMART_ASSISTANT_MESSAGES: Record<string, string> = {
  top: 'Need an Eye Test?',
  'about-portal': 'Curious about our story?',
  'face-shapes': 'Find your perfect frame',
  collection: 'Looking for Sunglasses?',
  frames: 'Need Blue Cut Glasses?',
  'lens-tech': 'Explore lens technology',
  'eye-test': 'Book Today',
  'appointment-portal': 'Reserve your free slot',
  reviews: 'Chat with Bajaj Optics',
  visit: 'Ready to visit us?',
};

import { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiChevronRight, HiArrowLeft } from 'react-icons/hi2';
import type { CategoryId } from '@/types/product';
import { AVAILABILITY_LABEL } from '@/types/product';
import {
  getCategoryMeta,
  getProductBySlug,
  getProductsByCategory,
  isCollectionCategory,
} from '@/data/products';
import { generateProductWhatsAppUrl } from '@/utils/whatsapp';
import { ProductImage } from '@/components/collection/ProductImage';
import { ProductCard } from '@/components/collection/ProductCard';
import { Eyebrow } from '@/components/ui/SplitReveal';
import { Seo } from '@/components/Seo';

const EASE = [0.16, 1, 0.3, 1] as const;

function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/8">
      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-ivory/40 font-mono">{label}</span>
      <span className="text-sm text-ivory/85 text-right">{value}</span>
    </div>
  );
}

export function ProductDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [activeImg, setActiveImg] = useState(0);

  const valid = category && slug && isCollectionCategory(category);
  const catId = category as CategoryId;
  const product = valid ? getProductBySlug(catId, slug) : undefined;
  const meta = valid ? getCategoryMeta(catId) : undefined;

  const related = useMemo(
    () =>
      product
        ? getProductsByCategory(catId)
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
        : [],
    [product, catId]
  );

  if (!valid || !product || !meta) return <Navigate to="/" replace />;

  const waUrl = generateProductWhatsAppUrl(product);

  return (
    <main className="relative bg-matte min-h-screen">
      <Seo
        title={product.name}
        description={`${product.name} — ${[product.frameShape, product.frameMaterial, product.color].filter(Boolean).join(', ')}. ${product.description} Enquire on WhatsApp with Bajaj Optics, Dewas.`}
        path={`/collections/${catId}/${product.slug}`}
        image={product.images[0]}
      />

      <div className="max-w-6xl mx-auto px-6 pt-[calc(var(--navbar-height,64px)+2rem)] pb-24 lg:pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[0.7rem] text-ivory/40 mb-8">
          <Link to="/" className="hover:text-mist-bright transition-colors">Home</Link>
          <HiChevronRight size={12} />
          <Link to={`/collections/${catId}`} className="hover:text-mist-bright transition-colors">{meta.title}</Link>
          <HiChevronRight size={12} />
          <span className="text-ivory/70 truncate max-w-[10rem]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-[calc(var(--navbar-height,64px)+2rem)] self-start">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/8"
            >
              <ProductImage
                src={product.images[activeImg]}
                alt={`${product.name} — view ${activeImg + 1}`}
                eager
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_60%,rgba(246,243,238,0.06)_75%,transparent_85%)]" />
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border transition-colors ${
                      i === activeImg ? 'border-mist-bright' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <Eyebrow>{meta.title}</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
            >
              {product.name}
            </motion.h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-base text-ivory/70">Price on enquiry</span>
              {product.availability && (
                <span className="glass rounded-full px-3 py-1 text-[0.65rem] tracking-wide text-mist-bright">
                  {AVAILABILITY_LABEL[product.availability]}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-ivory/60 leading-relaxed mt-6 font-light">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mt-8">
              <Spec label="Category" value={meta.title} />
              <Spec label="Frame Shape" value={product.frameShape} />
              <Spec label="Material" value={product.frameMaterial} />
              <Spec label="Colour" value={product.color} />
              <Spec label="Style" value={product.gender} />
              <Spec label="Lens Options" value={product.lensType?.join(', ')} />
              <Spec label="Product ID" value={product.id} />
            </div>

            {/* Enquire — desktop inline */}
            <div className="hidden lg:flex flex-col gap-3 mt-9">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] text-matte px-8 py-4 text-sm font-medium shadow-[0_8px_30px_rgba(37,211,102,0.28)] transition-transform hover:scale-[1.02] active:scale-95"
              >
                <FaWhatsapp size={19} />
                Enquire on WhatsApp
              </a>
              <p className="text-xs text-ivory/40">
                Opens WhatsApp with this frame's details ready to send — we'll confirm availability, pricing and fit.
              </p>
            </div>

            <Link
              to={`/collections/${catId}`}
              className="hidden lg:inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-mist-bright transition-colors mt-6"
            >
              <HiArrowLeft size={15} /> Back to {meta.title}
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ivory">You may also like</h2>
              <Link to={`/collections/${catId}`} className="text-sm text-ivory/50 hover:text-mist-bright transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky WhatsApp CTA — mobile only */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 p-4 bg-matte/85 backdrop-blur-md border-t border-white/8">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm text-ivory truncate">{product.name}</p>
            <p className="text-xs text-ivory/50">Price &amp; details on WhatsApp</p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-matte px-5 py-3 text-sm font-medium"
          >
            <FaWhatsapp size={17} />
            Enquire
          </a>
        </div>
      </div>
    </main>
  );
}

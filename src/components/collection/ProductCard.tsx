import { useRef, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowUpRight, HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import type { Product } from '@/types/product';
import { AVAILABILITY_LABEL } from '@/types/product';
import { generateProductWhatsAppUrl } from '@/utils/whatsapp';
import { colorHex } from '@/utils/catalog';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductImage } from './ProductImage';

const EASE = [0.16, 1, 0.3, 1] as const;

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function primaryBadge(p: Product): string | null {
  if (p.tags?.includes('new')) return 'New';
  if (p.tags?.includes('bestseller')) return 'Bestseller';
  if (p.tags?.includes('premium')) return 'Premium';
  if (p.availability && p.availability !== 'in-stock') return AVAILABILITY_LABEL[p.availability];
  return null;
}

function HeartButton({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      className="w-8 h-8 rounded-full glass flex items-center justify-center text-ivory/80 hover:text-mist-bright transition-colors"
    >
      {saved ? <HiHeart size={15} className="text-mist-bright" /> : <HiOutlineHeart size={15} />}
    </button>
  );
}

function EnquireButton({ product, compact }: { product: Product; compact?: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(generateProductWhatsAppUrl(product), '_blank', 'noopener,noreferrer');
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-matte font-medium transition-transform hover:scale-[1.03] active:scale-95 ${
        compact ? 'px-4 py-2 text-xs' : 'w-full py-2.5 text-sm'
      }`}
    >
      <FaWhatsapp size={compact ? 14 : 16} />
      Enquire
    </button>
  );
}

// ---- Tile (grid view) -----------------------------------------------------

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
    setImgOffset({ x: px * -12, y: py * -12 });
  }
  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setImgOffset({ x: 0, y: 0 });
    setHovered(false);
  }

  const badge = primaryBadge(product);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.05, ease: EASE }}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 transition-[border-color] duration-300 hover:border-mist-bright/40"
      >
        {/* Stretched link covers the card without nesting interactive elements */}
        <Link
          to={`/collections/${product.category}/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-[1]"
        />

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1.02 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ x: imgOffset.x, y: imgOffset.y }}
            className="absolute inset-[-5%]"
          >
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-matte/70 via-transparent to-transparent" />

          {badge && (
            <span className="absolute top-4 left-4 z-[2] glass rounded-full px-2.5 py-1 font-mono text-[0.56rem] tracking-wide text-mist-bright">
              {badge}
            </span>
          )}
          <div className="absolute top-4 right-4 z-[2]">
            <HeartButton product={product} />
          </div>

          {/* Hover quick-enquire */}
          <div className="absolute inset-x-4 bottom-4 z-[2] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
            <EnquireButton product={product} />
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base sm:text-lg text-ivory truncate">{product.name}</h3>
              <p className="text-[0.7rem] text-ivory/50 mt-0.5 font-mono tracking-wide truncate">
                {[product.frameShape, product.frameMaterial].filter(Boolean).join(' · ')}
              </p>
            </div>
            {product.color && (
              <span
                className="shrink-0 mt-1 w-4 h-4 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: colorHex(product.color) }}
                title={product.color}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
            <span className="text-sm text-ivory/90">
              {typeof product.price === 'number' ? formatINR(product.price) : 'On enquiry'}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.66rem] text-ivory/45 group-hover:text-mist-bright transition-colors">
              View <HiArrowUpRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Row (list view) ------------------------------------------------------

export function ProductListItem({ product, index }: { product: Product; index: number }) {
  const badge = primaryBadge(product);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.04, ease: EASE }}
      className="group relative flex gap-4 sm:gap-6 rounded-2xl overflow-hidden border border-white/5 hover:border-mist-bright/40 transition-colors p-3 sm:p-4"
    >
      <Link to={`/collections/${product.category}/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-[1]" />

      <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden">
        <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" sizes="150px" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {badge && (
            <span className="glass rounded-full px-2 py-0.5 font-mono text-[0.54rem] tracking-wide text-mist-bright">{badge}</span>
          )}
          {product.color && (
            <span className="inline-flex items-center gap-1.5 text-[0.66rem] text-ivory/45">
              <span className="w-3 h-3 rounded-full ring-1 ring-white/20" style={{ backgroundColor: colorHex(product.color) }} />
              {product.color}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-lg text-ivory truncate mt-1.5">{product.name}</h3>
        <p className="text-[0.72rem] text-ivory/50 font-mono tracking-wide truncate">
          {[product.frameShape, product.frameMaterial, product.gender].filter(Boolean).join(' · ')}
        </p>
        <p className="text-sm text-ivory/85 mt-2">
          {typeof product.price === 'number' ? formatINR(product.price) : 'On enquiry'}
        </p>
      </div>

      <div className="relative z-[2] flex flex-col items-end justify-center gap-2 shrink-0">
        <HeartButton product={product} />
        <EnquireButton product={product} compact />
      </div>
    </motion.div>
  );
}

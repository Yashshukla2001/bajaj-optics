import { useRef, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowUpRight } from 'react-icons/hi2';
import type { Product } from '@/types/product';
import { AVAILABILITY_LABEL } from '@/types/product';
import { ProductImage } from './ProductImage';

const EASE = [0.16, 1, 0.3, 1] as const;

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

/**
 * The one product card used across every collection grid. Mirrors the existing
 * category-tile language (glass border, parallax image, number badge, mist
 * accent) but links through to the product detail route.
 */
export function ProductCard({ product, index }: ProductCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
    setImgOffset({ x: px * -12, y: py * -12 });
  }
  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setImgOffset({ x: 0, y: 0 });
    setHovered(false);
  }

  const badge = product.tags?.includes('new')
    ? 'New'
    : product.tags?.includes('bestseller')
    ? 'Bestseller'
    : product.availability && product.availability !== 'in-stock'
    ? AVAILABILITY_LABEL[product.availability]
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.06, ease: EASE }}
    >
      <Link
        ref={ref}
        to={`/collections/${product.category}/${product.slug}`}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        aria-label={`View ${product.name}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="group relative flex flex-col aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 transition-[border-color] duration-300 hover:border-mist-bright/40"
      >
        {/* Image — parallax shift + zoom on hover */}
        <motion.div
          animate={{ scale: hovered ? 1.12 : 1.02 }}
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

        <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/35 to-matte/5" />
        {/* Glass reflection sweep on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent_35%,rgba(246,243,238,0.10)_50%,transparent_65%)]" />

        {/* Number badge */}
        <span className="absolute top-5 left-5 font-mono text-[0.62rem] text-ivory/40 group-hover:text-mist-bright transition-colors duration-300">
          {String(index + 1).padStart(2, '0')}
        </span>

        {badge && (
          <span className="absolute top-5 right-5 glass rounded-full px-2.5 py-1 font-mono text-[0.58rem] tracking-wide text-mist-bright">
            {badge}
          </span>
        )}

        {/* Content */}
        <div className="relative mt-auto p-5 sm:p-6" style={{ transform: 'translateZ(28px)' }}>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-lg sm:text-xl text-ivory truncate">{product.name}</h3>
              <p className="text-[0.72rem] text-ivory/55 mt-1 font-mono tracking-wide truncate">
                {[product.frameShape, product.frameMaterial].filter(Boolean).join(' · ')}
              </p>
            </div>
            <motion.span
              animate={{ rotate: hovered ? 45 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="shrink-0 w-8 h-8 rounded-full glass flex items-center justify-center"
            >
              <HiArrowUpRight className="text-ivory/70 group-hover:text-mist-bright transition-colors" size={14} />
            </motion.span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
            <span className="text-sm text-ivory/85">
              {typeof product.price === 'number' ? formatINR(product.price) : 'On enquiry'}
            </span>
            <span className="text-[0.68rem] text-ivory/45 group-hover:text-ivory/70 transition-colors">
              View details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

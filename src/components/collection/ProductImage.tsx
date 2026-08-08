import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Skip lazy-loading for above-the-fold hero images. */
  eager?: boolean;
  sizes?: string;
}

/**
 * Lazy-loaded, responsive product image. On load error it swaps to a consistent
 * glass/gradient placeholder so the luxury layout never breaks on a dead link.
 */
export function ProductImage({ src, alt, className = '', eager, sizes }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-[radial-gradient(circle_at_50%_35%,rgba(143,176,196,0.18),transparent_60%)] bg-charcoal-soft flex items-center justify-center ${className}`}
      >
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="opacity-30">
          <circle cx="8" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.2" className="text-mist-bright" />
          <circle cx="16" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.2" className="text-mist-bright" />
          <path d="M12 12h.01M3.5 11.5L2 12M20.5 11.5L22 12" stroke="currentColor" strokeWidth="1.2" className="text-mist-bright" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

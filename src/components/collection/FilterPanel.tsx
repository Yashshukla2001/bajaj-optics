import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import type { FilterState, FacetKey } from '@/types/product';
import type { AvailableFacet } from '@/hooks/useCollectionFilters';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FilterControlsProps {
  facets: AvailableFacet[];
  filters: FilterState;
  priceBounds: [number, number] | null;
  activeCount: number;
  onToggle: (key: FacetKey, value: string) => void;
  onPrice: (price: [number, number] | null) => void;
  onReset: () => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs tracking-wide transition-colors duration-200 border ${
        active
          ? 'bg-mist-bright text-matte border-mist-bright'
          : 'glass text-ivory/70 border-white/10 hover:text-ivory hover:border-mist-bright/40'
      }`}
    >
      {children}
    </button>
  );
}

/** The facet + price UI, shared by the desktop sidebar and the mobile sheet. */
export function FilterControls({
  facets,
  filters,
  priceBounds,
  activeCount,
  onToggle,
  onPrice,
  onReset,
}: FilterControlsProps) {
  const [floor, ceil] = priceBounds ?? [0, 0];
  const [lo, hi] = filters.price ?? [floor, ceil];

  return (
    <div className="flex flex-col gap-7">
      {facets.map((facet) => {
        const selected = filters.facets[facet.key] ?? [];
        return (
          <div key={facet.key}>
            <p className="eyebrow !text-[0.6rem] mb-3">{facet.label}</p>
            <div className="flex flex-wrap gap-2">
              {facet.values.map((value) => (
                <Chip
                  key={value}
                  active={selected.includes(value)}
                  onClick={() => onToggle(facet.key, value)}
                >
                  {value}
                </Chip>
              ))}
            </div>
          </div>
        );
      })}

      {priceBounds && ceil > floor && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow !text-[0.6rem]">Price</p>
            <span className="text-xs text-ivory/60 font-mono">
              ₹{lo.toLocaleString('en-IN')} – ₹{hi.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 px-0.5">
            <input
              type="range"
              min={floor}
              max={ceil}
              value={lo}
              step={100}
              aria-label="Minimum price"
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), hi);
                onPrice([v, hi]);
              }}
              className="w-full accent-mist-bright"
            />
            <input
              type="range"
              min={floor}
              max={ceil}
              value={hi}
              step={100}
              aria-label="Maximum price"
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), lo);
                onPrice([lo, v]);
              }}
              className="w-full accent-mist-bright"
            />
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="self-start text-xs text-ivory/55 hover:text-mist-bright transition-colors underline underline-offset-4"
        >
          Reset all filters ({activeCount})
        </button>
      )}
    </div>
  );
}

// ---- Mobile bottom-sheet drawer ------------------------------------------

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: ReactNode;
}

export function MobileFilterSheet({ open, onClose, resultCount, children }: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-matte/70 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[71] lg:hidden glass-light rounded-t-3xl max-h-[82vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8 shrink-0">
              <div className="mx-auto absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-ivory/20" />
              <p className="font-display font-bold text-lg text-ivory">Filters</p>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-ivory"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 no-scrollbar">{children}</div>

            <div className="p-5 border-t border-white/8 shrink-0">
              <button
                onClick={onClose}
                className="w-full rounded-full bg-mist-bright text-matte py-3.5 text-sm font-medium"
              >
                Show {resultCount} {resultCount === 1 ? 'frame' : 'frames'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiChevronDown, HiCheck } from 'react-icons/hi2';
import type { FilterState, FacetKey } from '@/types/product';
import type { AvailableFacet } from '@/hooks/useCollectionFilters';
import { tagLabel } from '@/utils/catalog';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FilterControlsProps {
  facets: AvailableFacet[];
  filters: FilterState;
  activeCount: number;
  onToggle: (key: FacetKey, value: string) => void;
  onReset: () => void;
}

function CheckRow({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 w-full py-1.5 text-left">
      <span
        className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
          active ? 'bg-mist-bright border-mist-bright' : 'border-white/20 group-hover:border-mist-bright/60'
        }`}
      >
        {active && <HiCheck size={11} className="text-matte" strokeWidth={1} />}
      </span>
      <span className={`text-[0.82rem] flex-1 transition-colors ${active ? 'text-ivory' : 'text-ivory/65 group-hover:text-ivory'}`}>
        {label}
      </span>
      <span className="text-[0.66rem] text-ivory/30 font-mono">{count}</span>
    </button>
  );
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="border-b border-white/8 pb-4">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full py-1.5">
        <span className="eyebrow !text-[0.6rem]">{title}</span>
        <HiChevronDown size={14} className={`text-ivory/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterControls({
  facets, filters, activeCount, onToggle, onReset,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {facets.map((facet, i) => (
        <Accordion key={facet.key} title={facet.label} defaultOpen={i < 4}>
          {facet.options.map((opt) => {
            const selected = filters.facets[facet.key] ?? [];
            const label = facet.key === 'tags' ? tagLabel(opt.value) : opt.value;
            return (
              <CheckRow
                key={opt.value}
                label={label}
                count={opt.count}
                active={selected.includes(opt.value)}
                onClick={() => onToggle(facet.key, opt.value)}
              />
            );
          })}
        </Accordion>
      ))}

      {activeCount > 0 && (
        <button onClick={onReset} className="self-start text-xs text-ivory/55 hover:text-mist-bright transition-colors underline underline-offset-4">
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
}

// ---- Mobile bottom-sheet --------------------------------------------------

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  title?: string;
  children: ReactNode;
}

export function MobileFilterSheet({ open, onClose, resultCount, title = 'Filters', children }: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={onClose} className="fixed inset-0 z-[70] bg-matte/70 backdrop-blur-sm lg:hidden" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[71] lg:hidden glass-light rounded-t-3xl max-h-[82vh] flex flex-col">
            <div className="relative flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8 shrink-0">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-ivory/20" />
              <p className="font-display font-bold text-lg text-ivory">{title}</p>
              <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full glass flex items-center justify-center text-ivory">
                <HiXMark size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 no-scrollbar" data-lenis-prevent>{children}</div>
            <div className="p-5 border-t border-white/8 shrink-0">
              <button onClick={onClose} className="w-full rounded-full bg-mist-bright text-matte py-3.5 text-sm font-medium">
                Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaStar } from 'react-icons/fa';
import { HiXMark } from 'react-icons/hi2';
import { BUSINESS } from '@/constants/business';

const EASE = [0.16, 1, 0.3, 1] as const;
const KEY = 'bajaj:reviewPrompt';
const SNOOZE_DAYS = 7;
const DELAY_MS = 3500;

// Google's official review flow (falls back to the live listing if unset).
const REVIEW_URL = BUSINESS.googleReviewUrl || BUSINESS.mapDirectionsUrl;

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return true;
    const data = JSON.parse(raw) as { reviewed?: boolean; dismissedAt?: number };
    if (data.reviewed) return false;
    if (data.dismissedAt && Date.now() - data.dismissedAt < SNOOZE_DAYS * 864e5) return false;
    return true;
  } catch {
    return true;
  }
}

function remember(reviewed: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ dismissedAt: Date.now(), reviewed }));
  } catch {
    /* ignore private-mode errors */
  }
}

/**
 * A gentle, animated Google-review prompt that appears a few seconds after the
 * site loads. Opens Google's real review page — never a fake form — and, once
 * dismissed or acted on, stays away for a week so it never nags.
 */
export function ReviewModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShow()) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close(reviewed: boolean) {
    remember(reviewed);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => close(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center p-5 bg-matte/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Leave a Google review"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-charcoal border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-8 sm:p-10 text-center overflow-hidden"
          >
            {/* soft glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,176,196,0.16),transparent_60%)]" />

            <button
              onClick={() => close(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors z-[2]"
            >
              <HiXMark size={18} />
            </button>

            <div className="relative z-[1]">
              {/* Google badge */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <FaGoogle className="text-charcoal" size={26} />
              </motion.div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mt-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: EASE }}
                  >
                    <FaStar className="text-mist-bright" size={20} />
                  </motion.span>
                ))}
              </div>

              <p className="mt-3 text-sm text-ivory/55">
                Rated <span className="text-ivory font-medium">{BUSINESS.googleRating}</span> by{' '}
                {BUSINESS.googleReviewCount.toLocaleString('en-IN')} happy customers
              </p>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ivory leading-tight mt-5">
                Loving your experience?
              </h2>
              <p className="text-sm text-ivory/60 mt-3 font-light max-w-sm mx-auto">
                A quick Google review helps another family in {BUSINESS.city} find us. It takes less than a minute.
              </p>

              <div className="flex flex-col gap-3 mt-7">
                <a
                  href={REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => close(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-mist-bright text-matte px-7 py-3.5 text-sm font-medium tracking-wide transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <FaGoogle className="text-charcoal" size={12} />
                  </span>
                  Leave a Google Review
                </a>
                <button
                  onClick={() => close(false)}
                  className="text-xs text-ivory/45 hover:text-ivory/75 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

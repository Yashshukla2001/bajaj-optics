import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { BUSINESS, whatsappMessage } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';

const RADIUS = 16;
const CIRC = 2 * Math.PI * RADIUS;

export function FloatingDock() {
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [dash, setDash] = useState(CIRC);
  const location = useLocation();

  // Collection & product pages render their own bottom action bar on mobile
  // (Filter/Sort, or Enquire). Lift the dock above it so nothing overlaps.
  const hasBottomBar = location.pathname.startsWith('/collections/');

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setDash(CIRC - v * CIRC);
      setShowTop(v > 0.08);
    });
    return unsub;
  }, [progress]);

  return (
    <div
      className={`fixed z-40 right-4 sm:right-6 flex flex-col items-center gap-2.5 ${
        hasBottomBar ? 'bottom-24 sm:bottom-6' : 'bottom-5 sm:bottom-6'
      }`}
    >
      {/* Back to top with scroll-progress ring */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors"
          >
            <svg className="absolute inset-0 -rotate-90" width="36" height="36">
              <circle cx="18" cy="18" r={RADIUS - 2} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
              <circle
                cx="18" cy="18" r={RADIUS - 2} fill="none" stroke="var(--color-mist-bright)" strokeWidth="1.5"
                strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"
              />
            </svg>
            <FaArrowUp size={11} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Secondary actions */}
      <a
        href={buildWhatsAppLink(whatsappMessage.eyeTest)}
        target="_blank" rel="noopener noreferrer" aria-label="Book Eye Test"
        className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors"
      >
        <HiOutlineCalendar size={16} />
      </a>
      <a
        href={`tel:${BUSINESS.phoneNumber.replace(/\s/g, '')}`}
        aria-label="Call us"
        className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors"
      >
        <FaPhoneAlt size={13} />
      </a>

      {/* Primary — WhatsApp */}
      <a
        href={buildWhatsAppLink(whatsappMessage.general)}
        target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-[#ffffff] shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <FaWhatsapp size={24} className="relative" />
      </a>
    </div>
  );
}

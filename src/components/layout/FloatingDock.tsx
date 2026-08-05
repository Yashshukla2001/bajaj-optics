import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { BUSINESS, whatsappMessage, SMART_ASSISTANT_MESSAGES } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';

const RADIUS = 18;
const CIRC = 2 * Math.PI * RADIUS;

function useSmartAssistantMessage(): string {
  const [message, setMessage] = useState(SMART_ASSISTANT_MESSAGES.top);

  useEffect(() => {
    const ids = Object.keys(SMART_ASSISTANT_MESSAGES);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setMessage(SMART_ASSISTANT_MESSAGES[visible.target.id] ?? SMART_ASSISTANT_MESSAGES.top);
        }
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: '-25% 0px -35% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return message;
}

export function FloatingDock() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [dash, setDash] = useState(CIRC);
  const assistantMessage = useSmartAssistantMessage();

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setDash(CIRC - v * CIRC);
      setShowBackToTop(v > 0.08);
    });
    return unsub;
  }, [progress]);

  return (
    <div className="fixed z-40 bottom-5 right-5 sm:bottom-8 sm:right-8 flex flex-col items-end gap-3">
      {/* Back to top — appears above everything once you've scrolled */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors shrink-0"
          >
            <svg className="absolute inset-0 -rotate-90" width="36" height="36">
              <circle cx="18" cy="18" r={RADIUS - 2} fill="none" stroke="rgba(246,243,238,0.15)" strokeWidth="1.5" />
              <circle
                cx="18" cy="18" r={RADIUS - 2} fill="none" stroke="#8FB0C4" strokeWidth="1.5"
                strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"
              />
            </svg>
            <FaArrowUp size={12} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Smart assistant label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={assistantMessage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="hidden sm:block text-[0.65rem] text-ivory/50 tracking-wide"
        >
          {assistantMessage}
        </motion.span>
      </AnimatePresence>

      {/* All three actions, always visible, in one simple row — nothing hidden, nothing to expand */}
      <div className="flex items-center gap-2.5">
        <a
          href={buildWhatsAppLink(whatsappMessage.eyeTest)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book Eye Test"
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors shrink-0"
        >
          <HiOutlineCalendar size={17} />
        </a>

        <a
          href={`tel:${BUSINESS.phoneNumber.replace(/\s/g, '')}`}
          aria-label="Call Us"
          className="w-11 h-11 rounded-full glass flex items-center justify-center text-ivory hover:text-mist-bright transition-colors shrink-0"
        >
          <FaPhoneAlt size={14} />
        </a>
<a
        
          href={buildWhatsAppLink(whatsappMessage.general)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-matte shadow-[0_8px_30px_rgba(37,211,102,0.35)] shrink-0"
        >
          <FaWhatsapp size={22} />
        </a>
      </div>
    </div>
  );
}
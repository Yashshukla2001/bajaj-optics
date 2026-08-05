import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS } from '@/constants/business';

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1900;
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onDone, 700);
        }, 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  // Two independent draw-in stages so the bridge only appears once both lenses exist
  const lensProgress = Math.min(1, progress / 0.7);
  const bridgeProgress = Math.max(0, (progress - 0.55) / 0.45);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-matte flex flex-col items-center justify-center gap-7"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            exit={{ scale: 14, opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.7, 0, 1, 1] }}
            className="relative"
          >
            <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
              <motion.circle
                cx="38" cy="35" r="30" stroke="#8FB0C4" strokeWidth="1.6"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - lensProgress)}
                strokeLinecap="round"
              />
              <motion.circle
                cx="102" cy="35" r="30" stroke="#8FB0C4" strokeWidth="1.6"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - lensProgress)}
                strokeLinecap="round"
                style={{ transformOrigin: '102px 35px' }}
              />
              <motion.path
                d="M60 32c4-6 16-6 20 0"
                stroke="#8FB0C4"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: bridgeProgress }}
              />
              {/* Faint glass glint sweeping through once the mark is complete */}
              {progress > 0.9 && (
                <motion.circle
                  cx="38" cy="35" r="30"
                  fill="none"
                  stroke="rgba(246,243,238,0.4)"
                  strokeWidth="1"
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1.15, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformOrigin: '38px 35px' }}
                />
              )}
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="eyebrow">{BUSINESS.name}</p>
            <div className="w-24 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-mist-bright"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
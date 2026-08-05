import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { BUSINESS, whatsappMessage } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { MagneticButton } from '@/components/ui/MagneticButton';

const WORDS = ['Your', 'Vision', 'Deserves', 'Better.'];

export function GrandFinale() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const glowX = useTransform(sx, [-1, 1], [30, 70]);
  const glowY = useTransform(sy, [-1, 1], [25, 65]);
  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(45rem 30rem at ${gx}% ${gy}%, rgba(143,176,196,0.14), transparent 60%)`
  );

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mx, my]);

 return (
    <section className="relative bg-matte py-24 sm:py-36 px-6 overflow-hidden">
      <motion.div aria-hidden className="absolute inset-0 opacity-70" style={{ background: glowBg }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(10,11,13,0.6))]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Kinetic headline — each word settles in with a heavy spring */}
        <h2 className="font-display font-bold text-[11vw] sm:text-7xl leading-[1.03] flex flex-wrap justify-center gap-x-4 sm:gap-x-5">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, scale: 1.3, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
                delay: i * 0.12,
              }}
              className={i === WORDS.length - 1 ? 'text-gradient-mist' : 'text-ivory'}
            >
              {word}
            </motion.span>
          ))}
        </h2>

       {/* Signature underline, draws in after the words land */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-32 sm:w-40 bg-gradient-to-r from-transparent via-mist-bright to-transparent mx-auto mt-6 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-5 text-ivory/55 max-w-lg mx-auto"
        >
          Book a free eye test today and see why {BUSINESS.city.split(',')[0]} trusts {BUSINESS.name}.
        </motion.p>

        {/* Curtain-call staggered CTAs */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.05 } } }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {[
            { href: buildWhatsAppLink(whatsappMessage.eyeTest), icon: <HiOutlineCalendar size={17} />, label: 'Book Free Eye Test', variant: undefined },
            { href: buildWhatsAppLink(whatsappMessage.general), icon: <FaWhatsapp size={16} />, label: 'Chat on WhatsApp', variant: 'outline' as const },
            { href: `tel:${BUSINESS.phoneNumber.replace(/\s/g, '')}`, icon: <FaPhoneAlt size={13} />, label: 'Call Now', variant: 'ghost' as const },
          ].map((btn) => (
            <motion.div
              key={btn.label}
              variants={{ hidden: { opacity: 0, y: 24, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <MagneticButton href={btn.href} variant={btn.variant} icon={btn.icon}>
                {btn.label}
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
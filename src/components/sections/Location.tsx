import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlineClock, HiOutlineTruck } from 'react-icons/hi2';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { BUSINESS, whatsappMessage } from '@/constants/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';

/** Parses "10:00 AM – 9:00 PM" style ranges and checks against the current time, live. */
function useLiveOpenStatus() {
  const [status, setStatus] = useState({ open: false, label: 'Checking…' });

  useEffect(() => {
    function compute() {
      const now = new Date();
      const day = now.getDay();
      const isSunday = day === 0;
      const entry = BUSINESS.timings.find((t) =>
        isSunday ? t.day === 'Sunday' : t.day.includes('Monday')
      );
      if (!entry) return setStatus({ open: false, label: 'Closed today' });

      const [openStr, closeStr] = entry.hours.split('–').map((s) => s.trim());
      const parse = (s: string) => {
        const [time, meridiem] = s.split(' ');
        const [h, m] = time.split(':').map(Number);
        let hour = h % 12;
        if (meridiem === 'PM') hour += 12;
        return hour * 60 + m;
      };
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const openMins = parse(openStr);
      const closeMins = parse(closeStr);
      const isOpen = nowMins >= openMins && nowMins < closeMins;

      setStatus({
        open: isOpen,
        label: isOpen ? `Open now · Closes ${closeStr}` : `Closed · Opens ${openStr}`,
      });
    }
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, []);

  return status;
}

export function Location() {
  const { open, label } = useLiveOpenStatus();

return (
    <section id="visit" className="relative bg-matte py-14 sm:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 max-w-xl mb-8">
          <div>
            <Eyebrow>Visit The Studio</Eyebrow>
            <SplitReveal
              as="h2"
              text="Come see us in person."
              className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Map, with the live status badge sitting above it (not overlapping) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    open ? 'bg-mist-bright animate-ping' : 'bg-ivory/30'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    open ? 'bg-mist-bright' : 'bg-ivory/40'
                  }`}
                />
              </span>
              <span className={`text-xs font-mono tracking-wide ${open ? 'text-mist-bright' : 'text-ivory/50'}`}>
                {label}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9 }}
              className="relative rounded-3xl overflow-hidden glass aspect-[4/3] lg:aspect-auto"
            >
              <iframe
                src={BUSINESS.mapEmbedUrl}
                title="Bajaj Optics location map"
                className="w-full h-full min-h-[20rem] grayscale-[40%] contrast-125 opacity-90"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass rounded-3xl p-8 flex flex-col gap-7"
          >
            <div className="flex gap-3.5">
              <HiOutlineMapPin className="text-mist-bright shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-ivory">{BUSINESS.address}</p>
            </div>

            <div className="flex gap-3.5">
              <HiOutlineClock className="text-mist-bright shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                {BUSINESS.timings.map((t) => (
                  <p key={t.day} className="text-sm text-ivory/70">
                    <span className="text-ivory/45">{t.day}:</span> {t.hours}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-3.5">
              <HiOutlineTruck className="text-mist-bright shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-ivory/70">Free parking available right outside the studio.</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 mt-auto">
              <MagneticButton href={BUSINESS.mapDirectionsUrl} variant="outline">
                Get Directions
              </MagneticButton>
              <MagneticButton
                href={`tel:${BUSINESS.phoneNumber.replace(/\s/g, '')}`}
                variant="ghost"
                icon={<FaPhoneAlt size={13} />}
              >
                Call
              </MagneticButton>
              <MagneticButton
                href={buildWhatsAppLink(whatsappMessage.general)}
                variant="ghost"
                icon={<FaWhatsapp size={15} />}
              >
                WhatsApp
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
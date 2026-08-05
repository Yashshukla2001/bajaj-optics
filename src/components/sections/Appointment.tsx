import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { openWhatsApp } from '@/utils/whatsapp';
import { sendAppointmentEmail } from '@/utils/emailjs';
import { BUSINESS } from '@/constants/business';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { HiOutlineCheckCircle, HiArrowLeft } from 'react-icons/hi2';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(10, 'Enter a valid phone number').regex(/^[0-9+\s-]+$/, 'Numbers only, please'),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TIMES = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'];

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const DAYS = nextDays(10);
const STEPS = ['Date & Time', 'Your Details', 'Confirm'];

export function Appointment() {
  const [step, setStep] = useState(0);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedDate = dayIndex !== null ? DAYS[dayIndex] : null;
  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    : '';

  async function goToDetails() {
    if (dayIndex === null || !time) return;
    setStep(1);
  }

  async function goToConfirm() {
    const valid = await trigger(['name', 'phone']);
    if (valid) setStep(2);
  }

  async function onConfirm() {
    const data = getValues();
    const message = [
      `Hi ${BUSINESS.name}, I'd like to book an eye test appointment.`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Preferred Date: ${dateLabel}`,
      `Preferred Time: ${time}`,
      data.message ? `Note: ${data.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    await sendAppointmentEmail({ name: data.name, phone: data.phone, date: dateLabel, time: time ?? '', message: data.message });
    openWhatsApp(message);
    setSubmitted(true);
  }

 return (
    <section id="book" className="relative bg-matte py-14 sm:py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-3">
          <Eyebrow>Reserve Your Slot</Eyebrow>
          <SplitReveal
            as="h2"
            text="Book your free eye test."
            className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 my-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i <= step ? 'bg-mist-bright' : 'bg-white/15'
                }`}
              />
              {i < STEPS.length - 1 && <span className={`h-px w-8 transition-colors duration-300 ${i < step ? 'bg-mist-bright' : 'bg-white/15'}`} />}
            </div>
          ))}
        </div>

        {/* Ticket card */}
        <div className="relative rounded-[1.75rem] glass overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10"
              >
                <p className="text-xs font-mono text-ivory/40 mb-4 tracking-wide">SELECT DATE</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                  {DAYS.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setDayIndex(i)}
                      className={`shrink-0 w-16 py-3 rounded-xl border text-center transition-colors duration-300 ${
                        dayIndex === i ? 'bg-mist-bright border-mist-bright text-matte' : 'border-white/10 text-ivory/70 hover:border-white/25'
                      }`}
                    >
                      <p className="text-[0.6rem] tracking-wide opacity-70">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                      <p className="font-display font-bold text-lg mt-0.5">{d.getDate()}</p>
                    </button>
                  ))}
                </div>

               <p className="text-xs font-mono text-ivory/40 mt-5 mb-3 tracking-wide">SELECT TIME</p>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-4 py-2 rounded-full border text-xs transition-colors duration-300 ${
                        time === t ? 'bg-mist-bright border-mist-bright text-matte' : 'border-white/10 text-ivory/70 hover:border-white/25'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <MagneticButton onClick={goToDetails} className={dayIndex === null || !time ? 'opacity-40 pointer-events-none' : ''}>
                    Continue
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 space-y-6"
              >
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-xs text-ivory/40 hover:text-ivory transition-colors mb-2">
                  <HiArrowLeft size={13} /> Back
                </button>

                <div>
                  <input
                    {...register('name')}
                    placeholder="Full name"
                    className="w-full bg-transparent border-b border-silver/25 focus:border-mist-bright py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors text-sm"
                  />
                  {errors.name && <p className="text-xs text-red-300/80 mt-1.5">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register('phone')}
                    placeholder="Phone number"
                    className="w-full bg-transparent border-b border-silver/25 focus:border-mist-bright py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors text-sm"
                  />
                  {errors.phone && <p className="text-xs text-red-300/80 mt-1.5">{errors.phone.message}</p>}
                </div>
                <div>
                  <textarea
                    {...register('message')}
                    placeholder="Anything we should know? (optional)"
                    rows={2}
                    className="w-full bg-transparent border-b border-silver/25 focus:border-mist-bright py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <MagneticButton onClick={goToConfirm}>Review Booking</MagneticButton>
                </div>
              </motion.div>
            )}

            {step === 2 && !submitted && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs text-ivory/40 hover:text-ivory transition-colors m-8 mb-0">
                  <HiArrowLeft size={13} /> Back
                </button>

                {/* Ticket stub layout */}
                <div className="px-8 sm:px-10 pt-4 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="eyebrow mb-1">{BUSINESS.name}</p>
                      <p className="font-display font-bold text-2xl text-ivory">Eye Test Pass</p>
                    </div>
                    <HiOutlineCheckCircle className="text-mist-bright" size={28} />
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div>
                      <p className="text-[0.6rem] font-mono text-ivory/35 tracking-wide">DATE</p>
                      <p className="font-display font-bold text-lg text-ivory mt-1">{dateLabel}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-mono text-ivory/35 tracking-wide">TIME</p>
                      <p className="font-display font-bold text-lg text-ivory mt-1">{time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[0.6rem] font-mono text-ivory/35 tracking-wide">GUEST</p>
                      <p className="font-display font-bold text-lg text-ivory mt-1">{getValues('name')}</p>
                    </div>
                  </div>
                </div>

                {/* Perforated tear line */}
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-white/15" />
                  <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-matte" />
                  <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-matte" />
                </div>

                <div className="px-8 sm:px-10 py-6 flex items-center justify-between">
                  <p className="text-[0.65rem] font-mono text-ivory/30">Confirmed via WhatsApp</p>
                  <MagneticButton onClick={handleSubmit(onConfirm)} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Confirm Booking'}
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {submitted && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-12 text-center"
              >
                <HiOutlineCheckCircle className="text-mist-bright mx-auto mb-4" size={36} />
                <p className="font-display font-bold text-xl text-ivory mb-2">You're booked.</p>
                <p className="text-sm text-ivory/50">Check WhatsApp to confirm your slot with us.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
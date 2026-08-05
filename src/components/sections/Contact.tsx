import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { openWhatsApp } from '@/utils/whatsapp';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Eyebrow, SplitReveal } from '@/components/ui/SplitReveal';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  message: z.string().min(5, 'Tell us a little about what you need'),
});

type FormData = z.infer<typeof schema>;

const fieldClass =
  'w-full bg-transparent border-b border-silver/25 focus:border-mist-bright py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors text-sm';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormData) {
    openWhatsApp(`Hi Bajaj Optics,\nName: ${data.name}\nPhone: ${data.phone}\nMessage: ${data.message}`);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  }
return (
    <section className="relative bg-matte py-14 sm:py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <Eyebrow>Get In Touch</Eyebrow>
        <SplitReveal
          as="h2"
          text="Have a question? Ask us anything."
          className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-tight"
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto mt-6 glass rounded-[2rem] p-8 sm:p-10 space-y-6"
        noValidate
      >
        <div>
          <input {...register('name')} placeholder="Your name" className={fieldClass} />
          {errors.name && <p className="text-xs text-red-300/80 mt-1.5">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('phone')} placeholder="Phone number" className={fieldClass} />
          {errors.phone && <p className="text-xs text-red-300/80 mt-1.5">{errors.phone.message}</p>}
        </div>
        <div>
          <textarea {...register('message')} placeholder="Your message" rows={3} className={`${fieldClass} resize-none`} />
          {errors.message && <p className="text-xs text-red-300/80 mt-1.5">{errors.message.message}</p>}
        </div>
        <div className="flex justify-center pt-2">
          <MagneticButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </MagneticButton>
        </div>
      </motion.form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 flex items-center gap-2.5 justify-center text-mist-bright text-sm"
          >
            <HiOutlineCheckCircle size={18} />
            Message ready — sent to WhatsApp.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

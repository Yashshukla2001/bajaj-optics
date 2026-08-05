import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

interface AppointmentPayload {
  name: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}

/**
 * Sends the appointment as an email via EmailJS (free tier, no backend needed).
 * Silently no-ops if VITE_EMAILJS_* env vars are not set — see README for setup.
 */
export async function sendAppointmentEmail(payload: AppointmentPayload): Promise<boolean> {
  if (!isEmailConfigured) return false;
  try {
    await emailjs.send(
      SERVICE_ID!,
      TEMPLATE_ID!,
      {
        from_name: payload.name,
        phone: payload.phone,
        preferred_date: payload.date,
        preferred_time: payload.time,
        message: payload.message ?? '',
      },
      { publicKey: PUBLIC_KEY! }
    );
    return true;
  } catch (err) {
    console.error('EmailJS send failed:', err);
    return false;
  }
}

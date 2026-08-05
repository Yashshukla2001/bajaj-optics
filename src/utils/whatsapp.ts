import { BUSINESS } from '@/constants/business';

/** Builds a wa.me deep link that opens WhatsApp with a prefilled message. */
export function buildWhatsAppLink(message: string, number: string = BUSINESS.whatsappNumber): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function openWhatsApp(message: string, number?: string): void {
  window.open(buildWhatsAppLink(message, number), '_blank', 'noopener,noreferrer');
}

import { BUSINESS, whatsappMessage } from '@/constants/business';
import type { Product } from '@/types/product';
import { getCategoryMeta } from '@/data/products';

/** Builds a wa.me deep link that opens WhatsApp with a prefilled message. */
export function buildWhatsAppLink(message: string, number: string = BUSINESS.whatsappNumber): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function openWhatsApp(message: string, number?: string): void {
  window.open(buildWhatsAppLink(message, number), '_blank', 'noopener,noreferrer');
}

/**
 * The single source of truth for a product enquiry link. Every "Enquire on
 * WhatsApp" button routes through here — no WhatsApp logic is duplicated in
 * components. The message uses the exact Bajaj Optics enquiry format.
 */
export function generateProductWhatsAppUrl(product: Product): string {
  const categoryTitle = getCategoryMeta(product.category)?.title ?? product.category;
  return buildWhatsAppLink(whatsappMessage.product(product, categoryTitle));
}

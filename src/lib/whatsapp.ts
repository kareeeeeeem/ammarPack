import siteConfig from '../../site.config';

export type InquiryKind = 'general' | 'product' | 'custom' | 'quote' | 'visit' | 'consultation' | 'moq';

const messages: Record<Exclude<InquiryKind, 'product'>, string> = {
  general: 'Hello Ammar Pack,\n\nI have a question about cardboard packaging for my business. Please let me know how to proceed.\n\nThank you.',
  custom: 'Hello Ammar Pack,\n\nI would like to discuss custom cardboard packaging. Please advise on available formats, printing options, and the information you need for a quotation.\n\nThank you.',
  quote: 'Hello Ammar Pack,\n\nI would like to request a quotation for cardboard packaging. Please let me know which specifications you need.\n\nThank you.',
  visit: 'Hello Ammar Pack,\n\nI would like to ask whether a factory visit can be arranged. Please advise on availability and the best way to schedule one.\n\nThank you.',
  consultation: 'Hello Ammar Pack,\n\nI would appreciate guidance on choosing a suitable box for my product. Please let me know what details to share.\n\nThank you.',
  moq: 'Hello Ammar Pack,\n\nCould you advise on the minimum order quantity for the packaging type I need? I can share dimensions, printing requirements, and estimated quantity.\n\nThank you.',
};

export function inquiryMessage(kind: InquiryKind, product?: string): string {
  if (kind === 'product') {
    return `Hello Ammar Pack,\n\nI would like to inquire about ${product || 'a cardboard packaging option'}. Please advise on available options and what information you need to prepare a quotation.\n\nThank you.`;
  }
  return messages[kind];
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

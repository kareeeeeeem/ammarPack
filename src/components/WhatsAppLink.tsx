import type { ReactNode } from 'react';
import { inquiryMessage, whatsappUrl, type InquiryKind } from '@/lib/whatsapp';

interface WhatsAppLinkProps {
  kind: InquiryKind;
  product?: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export default function WhatsAppLink({ kind, product, children, className, 'aria-label': ariaLabel }: WhatsAppLinkProps) {
  return <a href={whatsappUrl(inquiryMessage(kind, product))} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
    {children}
  </a>;
}

// Coloured pill for an inquiry status. There is no "confirmed" status on purpose (inquiry != reservation).
import { useTranslation } from 'react-i18next';
import type { InquiryStatus } from '../../types';

const styles: Record<InquiryStatus, string> = {
  new: 'bg-gold/25 text-gold-dark',
  contacted: 'bg-sky-100 text-sky-800',
  pending: 'bg-amber-100 text-amber-800',
  closed: 'bg-charcoal/10 text-charcoal/70',
};

export default function StatusBadge({ status }: { status: InquiryStatus }) {
  const { t } = useTranslation();
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{t(`enums.inquiryStatus.${status}`)}</span>;
}

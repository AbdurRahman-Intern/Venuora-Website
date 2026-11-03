// ---------------------------------------------------------------------------
// INQUIRY MANAGEMENT: search + filters + status change + delete (with confirmation).
// Filtering is done in memory with useMemo over the inquiries array.
//   search  : case-insensitive match on name, phone or e-mail
//   status  : exact match, or 'all'
//   kind    : 'event' | 'room' | 'all'
// Desktop shows a table; small screens show the same data as cards (wide tables are unusable on phones).
// TODO: with a backend, move filtering/pagination to the API (?status=new&q=ahmad&page=2).
// ---------------------------------------------------------------------------
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Phone, Search, Trash2 } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { rooms } from '../../data/rooms';
import { spaces } from '../../data/spaces';
import { useInquiries, usePackages } from '../../services/demoStore';
import { useLocale } from '../../hooks/useLocale';
import { formatDate } from '../../utils/dates';
import { normalizeDigits } from '../../utils/text';
import type { Inquiry, InquiryKind, InquiryStatus } from '../../types';

const STATUSES: InquiryStatus[] = ['new', 'contacted', 'pending', 'closed'];

export default function InquiriesPage() {
  const { t } = useTranslation();
  const { intl, tx } = useLocale();
  const { inquiries, updateStatus, removeInquiry } = useInquiries();
  const { packages } = usePackages();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all');
  const [kind, setKind] = useState<InquiryKind | 'all'>('all');
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);

  // Resolve the selected room/space/package id to a readable, translated name.
  const itemName = (i: Inquiry) => {
    if (!i.itemId) return '';
    const found = [...packages, ...spaces, ...rooms].find((x) => x.id === i.itemId);
    return found ? tx(found.name) : '';
  };
  const requested = (i: Inquiry) => (i.kind === 'room'
    ? `${formatDate(i.checkIn ?? '', intl, 'short')} → ${formatDate(i.checkOut ?? '', intl, 'short')}`
    : formatDate(i.eventDate ?? '', intl, 'short'));

  const filtered = useMemo(() => {
    const q = normalizeDigits(query).trim().toLowerCase();
    return inquiries
      .filter((i) => (status === 'all' || i.status === status) && (kind === 'all' || i.kind === kind))
      .filter((i) => !q || [i.customerName, i.phone, i.email].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first
  }, [inquiries, query, status, kind]);

  const statusSelect = (i: Inquiry) => (
    <select aria-label={t('dashboard.inquiries.updateStatus', { name: i.customerName })} value={i.status}
      onChange={(e) => updateStatus(i.id, e.target.value as InquiryStatus)} className="field !w-auto !py-1.5 text-xs">
      {STATUSES.map((s) => <option key={s} value={s}>{t(`enums.inquiryStatus.${s}`)}</option>)}
    </select>
  );
  const contactLinks = (i: Inquiry) => (
    <div className="space-y-1 text-xs text-charcoal/70">
      <p className="flex items-center gap-1.5"><Phone size={12} aria-hidden="true" /><span className="ltr-text">{i.phone}</span></p>
      {i.email && <p className="flex items-center gap-1.5"><Mail size={12} aria-hidden="true" /><span className="ltr-text">{i.email}</span></p>}
      <p className="flex items-center gap-1.5 text-charcoal/50"><MessageCircle size={12} aria-hidden="true" />{t(`enums.contactMethod.${i.contactMethod}`)}</p>
    </div>
  );
  const delBtn = (i: Inquiry) => (
    <button type="button" onClick={() => setToDelete(i)} aria-label={`${t('dashboard.inquiries.delete')}: ${i.customerName}`} className="rounded-md p-2 text-red-700 hover:bg-red-50"><Trash2 size={16} aria-hidden="true" /></button>
  );
  const service = (i: Inquiry) => (<><span className="font-medium">{t(`enums.inquiryKind.${i.kind}`)}</span>{i.eventType && <span className="text-charcoal/60"> · {t(`enums.eventType.${i.eventType}`)}</span>}{itemName(i) && <span className="block text-xs text-charcoal/55">{itemName(i)}</span>}</>);

  return (
    <>
      <PageHeader title={t('dashboard.inquiries.title')} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('dashboard.inquiries.searchPlaceholder')} aria-label={t('common.search')} className="field !ps-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as InquiryStatus | 'all')} aria-label={t('dashboard.inquiries.filterStatus')} className="field sm:!w-44">
          <option value="all">{t('dashboard.inquiries.filterStatus')}: {t('common.all')}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t(`enums.inquiryStatus.${s}`)}</option>)}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value as InquiryKind | 'all')} aria-label={t('dashboard.inquiries.filterKind')} className="field sm:!w-44">
          <option value="all">{t('dashboard.inquiries.filterKind')}: {t('common.all')}</option>
          <option value="event">{t('enums.inquiryKind.event')}</option>
          <option value="room">{t('enums.inquiryKind.room')}</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-serif text-xl text-emerald">{inquiries.length === 0 ? t('dashboard.inquiries.emptyAll') : t('dashboard.inquiries.empty')}</p>
          <p className="mt-2 text-sm text-charcoal/60">{inquiries.length === 0 ? t('dashboard.inquiries.emptyAllHint') : t('dashboard.inquiries.emptyHint')}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead className="bg-sage/40 text-xs uppercase tracking-wider text-charcoal/60">
                <tr>{['customer', 'contact', 'service', 'preferredDate', 'status', 'received'].map((h) => <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">{t(h === 'status' ? 'common.status' : `dashboard.inquiries.${h}`)}</th>)}<th scope="col" className="px-4 py-3 text-start font-semibold">{t('common.actions')}</th></tr>
              </thead>
              <tbody className="divide-y divide-emerald/10">
                {filtered.map((i) => (
                  <tr key={i.id} className="align-top">
                    <td className="px-4 py-4 font-medium">{i.customerName}{i.message && <span className="mt-1 block max-w-[14rem] truncate text-xs font-normal text-charcoal/50" title={i.message}>{i.message}</span>}</td>
                    <td className="px-4 py-4">{contactLinks(i)}</td>
                    <td className="px-4 py-4">{service(i)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{requested(i)}</td>
                    <td className="px-4 py-4"><div className="space-y-2"><StatusBadge status={i.status} />{statusSelect(i)}</div></td>
                    <td className="px-4 py-4 whitespace-nowrap text-charcoal/65">{formatDate(i.createdAt.slice(0, 10), intl, 'short')}</td>
                    <td className="px-4 py-4">{delBtn(i)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="space-y-4 lg:hidden">
            {filtered.map((i) => (
              <li key={i.id} className="card p-5">
                <div className="flex items-start justify-between gap-3"><p className="font-semibold">{i.customerName}</p><StatusBadge status={i.status} /></div>
                <div className="mt-3 text-sm">{service(i)}</div>
                <p className="mt-1 text-sm text-charcoal/70">{t('dashboard.inquiries.preferredDate')}: {requested(i)}</p>
                <div className="mt-3">{contactLinks(i)}</div>
                {i.message && <p className="mt-3 rounded-lg bg-ivory p-3 text-xs text-charcoal/70">{i.message}</p>}
                <div className="mt-4 flex items-center justify-between gap-3">{statusSelect(i)}{delBtn(i)}</div>
                <p className="mt-3 text-xs text-charcoal/45">{t('dashboard.inquiries.received')}: {formatDate(i.createdAt.slice(0, 10), intl, 'short')}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog open={!!toDelete} title={t('dashboard.inquiries.deleteTitle')} confirmLabel={t('common.delete')}
        message={t('dashboard.inquiries.deleteMessage', { name: toDelete?.customerName ?? '' })}
        onCancel={() => setToDelete(null)} onConfirm={() => { if (toDelete) removeInquiry(toDelete.id); setToDelete(null); }} />
    </>
  );
}

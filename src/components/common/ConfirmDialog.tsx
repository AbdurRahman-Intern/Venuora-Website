// ---------------------------------------------------------------------------
// Modal dialog + confirm dialog. Uses the native <dialog> element, which gives us focus trapping,
// Escape-to-close and the backdrop for free. Positioning is centred, so it is identical in LTR/RTL.
// ---------------------------------------------------------------------------
import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import Button from './Button';

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);

  // Sync the `open` prop with the native dialog (showModal/close are imperative APIs).
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }} // click on backdrop
      className={`m-auto w-[calc(100%-2rem)] ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-emerald/60`}
    >
      {open && (
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl">{title}</h2>
            <button type="button" onClick={onClose} aria-label={t('common.close')} className="rounded-md p-1 text-charcoal/60 hover:bg-sage/60">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm leading-relaxed text-charcoal/75">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

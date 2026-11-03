// Shows a formatted price in the active locale, or "Contact for pricing" when price is null.
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../hooks/useLocale';
import { formatCurrency } from '../../utils/dates';

export default function Price({ amount, currency }: { amount: number | null; currency: string }) {
  const { t } = useTranslation();
  const { intl } = useLocale();
  return <>{amount === null ? t('common.contactForPricing') : formatCurrency(amount, currency, intl)}</>;
}

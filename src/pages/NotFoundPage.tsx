import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-4xl">{t('common.pageNotFound')}</h1>
      <p className="mt-3 text-charcoal/70">{t('common.pageNotFoundText')}</p>
      <Button to="/" variant="dark" className="mt-8">{t('common.goHome')}</Button>
    </main>
  );
}

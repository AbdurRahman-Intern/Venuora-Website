// FAQ: builds accordion items from marketing.faq.items.<id>.{q,a}. Add a question = add an id here + keys in all 4 locale files.
import { useTranslation } from 'react-i18next';
import Accordion from '../common/Accordion';
import SectionHeading from '../common/SectionHeading';

const ids = ['what', 'custom', 'inquiries', 'whatsapp', 'languages', 'mobile', 'maintenance', 'future'];

export default function Faq() {
  const { t } = useTranslation();
  const items = ids.map((id) => ({ id, question: t(`marketing.faq.items.${id}.q`), answer: t(`marketing.faq.items.${id}.a`) }));
  return (
    <section id="faq" className="section scroll-target bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.faq.eyebrow')} title={t('marketing.faq.title')} />
        <div className="mx-auto mt-12 max-w-3xl"><Accordion items={items} /></div>
      </div>
    </section>
  );
}

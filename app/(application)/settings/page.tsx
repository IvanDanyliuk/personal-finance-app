import {useTranslations} from 'next-intl';
import { headers } from 'next/headers';


export default function SettingsPage() {
  const t = useTranslations('SettingsPage');

  return (
    <div>
      <h1 className='text-3xl font-semibold'>
        {t('title')}
      </h1>
      <div>

      </div>
    </div>
  );
};
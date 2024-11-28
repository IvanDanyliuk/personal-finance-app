import { auth } from '@/auth';
import { getUser } from '@/lib/actions/user.actions';
import {useTranslations} from 'next-intl';
import { getTranslations } from 'next-intl/server';


export default async function SettingsPage() {
  const t = await getTranslations('SettingsPage');
  const session = await auth();
  const user = await getUser(session?.user?.email!);

  console.log('SETTINGS', {
    session: session?.user,
    user
  })

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
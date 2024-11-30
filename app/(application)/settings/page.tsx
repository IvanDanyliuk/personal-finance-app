import { auth } from '@/auth';
import { getUser } from '@/lib/actions/user.actions';
import {useTranslations} from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ManageProfilePhoto } from './_components';
import { ManagePersonalData } from './_components/manage-personal-data';


export default async function SettingsPage() {
  const t = await getTranslations('SettingsPage');
  const session = await auth();
  const user = await getUser(session?.user?.email!);

  return (
    <div className='w-full h-full'>
      <h1 className='mb-3 text-3xl font-semibold'>
        {t('title')}
      </h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3'>
        <div>
          <div className='w-full flex justify-between items-center'>
            <Image 
              src={user?.image!} 
              alt={user?.name!} 
              width={150} 
              height={150} 
              className='rounded-full'
            />
            <ManageProfilePhoto 
              userId={user?.id!} 
              currentUserImageUrl={user?.image!} 
            />
          </div>
          <ManagePersonalData 
            variant='name' 
            currentUserName={user?.name!} 
          />
          <ManagePersonalData 
            variant='email' 
            currentUserEmail={user?.email!} 
          />
        </div>
        <div className=' bg-slate-400'>
          Finance
        </div>
        <div className=' bg-slate-400'>
          Profile
        </div>
      </div>
    </div>
  );
};
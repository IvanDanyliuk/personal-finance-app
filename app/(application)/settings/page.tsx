import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getUser, getUserById } from '@/lib/actions/user.actions';
import { ManageProfilePhoto, ManagePersonalData, ManageProfileData, ManageFinanceData, ManagePassword } from './_components';
import UserImagePlaceholder from '@/public/images/user-placeholder.png';


export default async function SettingsPage() {
  const t = await getTranslations('SettingsPage');
  const session = await auth();
  const user = await getUserById(session?.user?.id!);
  const userImage = user && user.image ? user.image : UserImagePlaceholder;

  return (
    <div className='w-full h-full'>
      <h1 className='mb-3 text-3xl font-semibold'>
        {t('title')}
      </h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-3'>
          <div className='w-full flex justify-between items-center'>
            <Image 
              src={userImage} 
              alt={user?.name!} 
              width={150} 
              height={150} 
              className='rounded-full'
            />
            <ManageProfilePhoto />
          </div>
          <ManagePersonalData 
            variant='name' 
            currentUserName={user?.name!} 
          />
          <ManagePersonalData 
            variant='email' 
            currentUserEmail={user?.email!} 
          />
          <ManagePassword />
        </div>
        <div className=' bg-slate-400'>
          <ManageFinanceData />
        </div>
        <div className=' bg-slate-400'>
          <ManageProfileData />
        </div>
      </div>
    </div>
  );
};
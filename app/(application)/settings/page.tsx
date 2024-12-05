import { auth } from '@/auth';
import { getUser } from '@/lib/actions/user.actions';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ManageProfilePhoto } from './_components';
import { ManagePersonalData } from './_components/manage-personal-data';
import UserImagePlaceholder from '@/public/images/user-placeholder.png';


export default async function SettingsPage() {
  const t = await getTranslations('SettingsPage');
  const session = await auth();
  const user = await getUser(session?.user?.email!);
  const userImage = user && user.image ? user.image : UserImagePlaceholder

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
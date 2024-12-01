'use client';

import { SubmitButton } from '@/components/common/submit-btn';
import { FileInput } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';


interface IManageProfilePhoto {
  userId: string;
  currentUserImageUrl: string;
};


export const ManageProfilePhoto: React.FC<IManageProfilePhoto> = ({ userId, currentUserImageUrl }) => {
  const t = useTranslations('SettingsPage');

  const handlePhotoDelete = () => {
    console.log('REMOVE PHOTO')
  };

  return (
    <div className='flex flex-col gap-3'>
      <Dialog>
        <DialogTrigger className='w-52 py-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'>
          {t('manageUserPhotoForm.triggerBtnLabel')}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className='m-center text-lg font-semibold'>
            {t('manageUserPhotoForm.formTitle')}
          </DialogHeader>
          <form action="">
            <FileInput 
              name='image'
              btnTitle={t('manageUserPhotoForm.addBtnLabel')}
            />
            <SubmitButton>
              {t('manageUserPhotoForm.submitBtnLabel')}
            </SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
      <Button 
        type='button' 
        onClick={handlePhotoDelete}
        className='w-52 py-6 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'>
        {t('')}
      </Button>
    </div>
  );
};
'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common/submit-btn';
import { FileInput } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateUserPhoto } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';


interface IManageProfilePhoto {
  userId: string;
  currentUserImageUrl: string;
};


export const ManageProfilePhoto: React.FC<IManageProfilePhoto> = ({ userId, currentUserImageUrl }) => {
  const t = useTranslations('SettingsPage');

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const action = updateUserPhoto.bind(null, { userId, currentUserImageUrl });
  const [state, formAction] = useFormState<any, any>(action, {});

  const handleModalOpen = () => setIsOpen(!isOpen);

  const handlePhotoDelete = () => {
    console.log('REMOVE PHOTO')
  };

  useEffect(() => {
    if(isOpen && state && state.status === ActionStatus.Success) {
      setIsOpen(false);
    }
  }, [state, formAction])

  return (
    <div className='flex flex-col gap-3'>
      <Dialog open={isOpen} onOpenChange={handleModalOpen}>
        <DialogTrigger className='w-52 py-3 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'>
          {t('manageUserPhotoForm.triggerBtnLabel')}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className='m-center text-lg font-semibold'>
            {t('manageUserPhotoForm.formTitle')}
          </DialogHeader>
          <form action={formAction}>
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
        {t('manageUserPhotoForm.deleteBtnLabel')}
      </Button>
    </div>
  );
};
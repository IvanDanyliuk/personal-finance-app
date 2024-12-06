'use client';

import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
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
import { deleteUserPhoto, updateUserPhoto } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/public/images/tube-spinner.svg';


export const ManageProfilePhoto: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useFormState<any, any>(updateUserPhoto, {});

  const handleModalOpen = () => setIsOpen(!isOpen);

  const handlePhotoDelete = async () => {
    startTransition(async () => {
      const actionResponse = await deleteUserPhoto();
      toast({
        description: t(actionResponse.status === ActionStatus.Success ? 
          'actionMessages.profileImageDeleted' : 
          'errors.deleteImageFailed'),
        variant: actionResponse.status === ActionStatus.Success ? 
          'default' : 
          'destructive',
        className: actionResponse.status === ActionStatus.Success ? 
          'bg-success-1 text-success-2' : 
          'bg-danger-1 text-danger-2'
      });
    });
  };

  useEffect(() => {
    if(isOpen && state && state.status === ActionStatus.Success) {
      if(state && state.updatedImageUrl) {
        update({ image: state.updatedImageUrl }).then(res => toast({
          description: t('actionMessages.profilePhotoUpdated'),
          variant: 'default',
          className: 'bg-success-1 text-success-2'
        }));
      }
      setIsOpen(false);
    }
    if(isOpen && state && state.error) {
      toast({
        description: t('errors.uploadImageFailed'),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      })
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
        disabled={Boolean(!session?.user?.image) || isPending}
        onClick={handlePhotoDelete}
        className='w-52 py-6 bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'
      >
        {
          isPending ? 
          <Image 
            src={Spinner} 
            alt='Loading' 
            width={20} 
            height={20} 
          /> : 
          <>
            {t('manageUserPhotoForm.deleteBtnLabel')}
          </>
      }
        
      </Button>
    </div>
  );
};
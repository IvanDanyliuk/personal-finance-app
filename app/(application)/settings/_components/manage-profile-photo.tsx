'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { updateUserPhotoSchema, UpdateUserPhotoSchema } from '@/lib/types/form-schemas/settings';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/public/images/tube-spinner.svg';


export const ManageProfilePhoto: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<UpdateUserPhotoSchema>({
    resolver: zodResolver(updateUserPhotoSchema),
  });

  const {
    register, 
    handleSubmit,
    setValue,  
    formState: { errors, isSubmitting }
  } = form;

  const handleModalOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<UpdateUserPhotoSchema> = async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);

    const { status, error, updatedImageUrl } = await updateUserPhoto(formData);

    if(status === ActionStatus.Success && updatedImageUrl) {
      update({ image: updatedImageUrl }).then(() => toast({
        description: t('actionMessages.profilePhotoUpdated'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      }));
      setIsOpen(false);
    }

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('errors.general.title'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  const handlePhotoDelete = async () => {
      setIsPending(true)
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
      setIsPending(false);
  };

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
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <FileInput 
              name='image'
              register={register}
              setValue={setValue}
              btnTitle={t('manageUserPhotoForm.addBtnLabel')}
              error={errors['image']?.message}
            />
            <SubmitButton isSubmitting={isSubmitting}>
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
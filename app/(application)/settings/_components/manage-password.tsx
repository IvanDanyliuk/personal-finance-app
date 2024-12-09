'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common';
import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { newPasswordSchema, NewPasswordSchema } from '@/lib/types/form-schemas/settings';


export const ManagePassword: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<NewPasswordSchema> = async (data) => {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);
    formData.append('confirmNewPassword', data.confirmNewPassword);
    const { status, error } = await updatePassword(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('actionMessages.signInSuccess'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
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

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger className='px-7 py-3 w-fit bg-primary-7 hover:bg-primary-6 rounded-full text-white font-semibold'>
        {t('managePassword.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <TextField 
            name='currentPassword' 
            label={t('managePassword.currentPasswordLabel')} 
            type='password'
            register={register} 
            error={errors['currentPassword']?.message} 
          />
          <TextField 
            name='newPassword' 
            label={t('managePassword.newPasswordLabel')} 
            type='password'
            register={register} 
            error={errors['newPassword']?.message} 
          />
          <TextField 
            name='confirmNewPassword' 
            label={t('managePassword.confirmNewPasswordLabel')} 
            type='password'
            register={register} 
            error={errors['confirmNewPassword']?.message} 
          />
          <div className='flex gap-3'>
            <SubmitButton isSubmitting={isSubmitting}>
              {t('managePassword.submitBtnLabel')}
            </SubmitButton>
            <Button 
              type='button' 
              onClick={handleDialogOpen} 
              className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'
            >
              {t('managePassword.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
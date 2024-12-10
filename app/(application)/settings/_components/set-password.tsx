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
import { ActionStatus } from '@/lib/types/common.types';
import { SetPasswordSchema, setPasswordSchema } from '@/lib/types/form-schemas/settings';
import { setPassword } from '@/lib/actions/user.actions';


export const SetPassword: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();

  const form = useForm<SetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<SetPasswordSchema> = async (data) => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);

    const { status, error } = await setPassword(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('actionMessages.passwordSet'),
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
        {t('setPassword.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <TextField 
            name='password' 
            label={t('setPassword.passwordLabel')} 
            type='password'
            register={register} 
            error={errors['password']?.message} 
          />
          <TextField 
            name='confirmPassword' 
            label={t('setPassword.confirmPasswordLabel')} 
            type='password'
            register={register} 
            error={errors['confirmPassword']?.message} 
          />
          <div className='flex gap-3'>
            <SubmitButton isSubmitting={isSubmitting}>
              {t('setPassword.submitBtnLabel')}
            </SubmitButton>
            <Button 
              type='button' 
              onClick={handleDialogOpen} 
              className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'
            >
              {t('setPassword.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
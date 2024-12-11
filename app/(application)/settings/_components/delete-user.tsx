'use client';

import { ConfirmDialog } from '@/components/common';
import { TextField } from '@/components/inputs';
import { useToast } from '@/hooks/use-toast';
import { deleteUser } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { deleteUserSchema, DeleteUserSchema } from '@/lib/types/form-schemas/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';


export const DeleteUser: React.FC = () => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();
  const router = useRouter();
  const { update } = useSession();

  const form = useForm<DeleteUserSchema>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: { 
      email: '', 
    },
  });

  const {
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const onSubmitForm: SubmitHandler<DeleteUserSchema> = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    const { status, error } = await deleteUser(formData);

    if(status === ActionStatus.Success) {
      update(null).then(() => router.push('/sign-in'));
      toast({
        description: t('actionMessages.userDeleted'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      ;
    }

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('errors.general'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <ConfirmDialog
      triggerBtnLabel='SettingsPage.deleteUser.confirmationModal.btnLabel'
      title='SettingsPage.deleteUser.confirmationModal.title'
      message='SettingsPage.deleteUser.confirmationModal.message'
      action={handleSubmit(onSubmitForm)}
      disabled={isSubmitting}
    >
      <form>
        <TextField 
          name='email'
          label={t('deleteUser.confirmationModal.emailFieldLabel')}
          register={register}
          error={errors['email']?.message}
        />
      </form>
    </ConfirmDialog>
  );
};
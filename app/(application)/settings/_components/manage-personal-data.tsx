'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/common';
import { updateUserData } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import { ActionStatus } from '@/lib/types/common.types';
import { updateUserDataSchema, UpdateUserDataSchema } from '@/lib/types/form-schemas/settings';


interface IManagePersonalData {
  variant: 'name' | 'email';
  currentUserName?: string;
  currentUserEmail?: string;
};


export const ManagePersonalData: React.FC<IManagePersonalData> = ({ 
  variant, 
  currentUserName, 
  currentUserEmail 
}) => {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();
  const { update } = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<UpdateUserDataSchema>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { name: '', email: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<UpdateUserDataSchema> = async (data) => {
    const formData = new FormData();
    if(data.name) formData.append('name', data.name);
    if(data.email) formData.append('email', data.email);

    const { status, name, email, error } = await updateUserData(formData);

    if(status === ActionStatus.Success && !error) {
      const updateQuery = name ? 
        { name } : 
        email ? 
          { email } : 
          null;

      if(updateQuery) {
        update(updateQuery).then(() => toast({
          description: t((name ? 
            'actionMessages.userNameUpdated' : 
            email ? 
              'actionMessages.userEmailUpdated' : 
              ''
          )),
          variant: 'default',
          className: 'bg-success-1 text-success-2'
        }));

        setIsOpen(false);
      }
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
    <div className='w-full flex justify-between items-center'>
      <p className='text-sm md:text-base font-semibold'>
        {t(variant === 'name' ? 'managePersonalData.editNameFormLabel' : 'managePersonalData.editEmailFormLabel')}
      </p>
      <div className='flex justify-between items-center gap-3'>
        <p className='text-sm md:text-base font-semibold'>
          {variant === 'name' ? currentUserName : currentUserEmail}
        </p>
        <Dialog 
          open={isOpen} 
          onOpenChange={handleFormOpen}
        >
          <DialogTrigger className='p-3 bg-primary-7 hover:bg-primary-6 rounded-full text-sm md:text-base text-white'>
            <Pencil className='w-5 h-5' />
          </DialogTrigger>
          <DialogContent className='py-6'>
            <DialogHeader>
              <DialogTitle>
                {t(
                  variant === 'name' ? 
                    'managePersonalData.updateNameFormTitle' : 
                    'managePersonalData.updateEmailFormTitle'
                )}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitForm)} className='relative'>
              <TextField 
                name={variant === 'name' ? 'name' : 'email'} 
                type={variant === 'email' ? 'email' : 'text'}
                placeholder={variant === 'name' ? currentUserName : currentUserEmail}
                register={register} 
                error={errors[variant === 'name' ? 'name' : 'email']?.message} 
              />
              <div className='flex gap-3'>
                <SubmitButton isSubmitting={isSubmitting}>
                  {t('managePersonalData.submitBtnLabel')}
                </SubmitButton>
                <Button 
                  type='button' 
                  onClick={handleFormOpen} 
                  className='py-6 mt-3 w-full rounded-full bg-secondary-2 hover:bg-secondary-1 font-semibold'
                >
                  {t('managePersonalData.cancelBtnLabel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
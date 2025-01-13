'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { bankSchema, BankSchema } from '@/lib/types/form-schemas/admin';
import { Combobox, FileInput, TextField } from '@/components/inputs';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import { createBank } from '@/lib/actions/bank.actions';
import { SubmitButton } from '@/components/common';
import { COUNTRIES } from '@/lib/constants';


export const BankForm = () => {
  const t = useTranslations();
  const { toast } = useToast();

  const [isOpen, setOpen] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    reset
  } = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      name: '',
      country: '',
      logo: null,
    }
  });

  const handleMenuOpen = () => setOpen(!isOpen);

  const onFormSubmit: SubmitHandler<BankSchema> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('country', data.country);
    formData.append('logo', data.logo);

    const { status, error } = await createBank(formData);
    
    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('Admin.Banks.actionMessages.createBankSuccess'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      reset();
      setOpen(false);
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('Admin.Banks.errors.general.title'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleMenuOpen}>
      <DialogTrigger>
        {t('Admin.Banks.bankForm.formTriggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('Admin.Banks.bankForm.formTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-3'>
          <Controller 
            name='name'
            control={control}
            render={({ field }) => (
              <TextField 
                name='name'
                label={t('Admin.Banks.bankForm.nameFieldLabel')}
                field={field}
                error={errors['name']?.message}
              />
            )}
          />
          <Controller 
            name='country'
            control={control}
            render={({ field }) => (
              <Combobox 
                name='country'
                label={t('Admin.Banks.bankForm.countryFieldLabel')}
                field={field}
                placeholder={t('Admin.Banks.bankForm.countryFieldPlaceholder')}
                options={COUNTRIES}
              />
            )}
          />
          <Controller 
            name='logo'
            control={control}
            render={({ field }) => (
              <FileInput 
                name='logo'
                label={t('Admin.Banks.bankForm.logoFieldLabel')}
                btnTitle={t('Admin.Banks.bankForm.logoUploadBtnLabel')}
                field={field}
                setValue={setValue}
                error={errors['logo']?.message}
              />
            )}
          />
          <SubmitButton isSubmitting={isSubmitting}>
            {t('Admin.Banks.bankForm.submitBtnLabel')}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};
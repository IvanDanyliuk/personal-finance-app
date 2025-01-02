'use client';

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { bankSchema, BankSchema } from '@/lib/types/form-schemas/admin';
import { Combobox, FileInput, TextField } from '@/components/inputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import { createBank } from '@/lib/actions/bank.actions';
import { useRouter } from 'next/navigation';
import { COUNTRIES } from '@/lib/constants';
import { SubmitButton } from '@/components/common';


export const BankForm = () => {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();

  const [isOpen, setOpen] = useState<boolean>(false);
  const countries = COUNTRIES
  console.log('BANK FORM', countries)

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    // register,
    handleSubmit
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

    console.log('BANK FORM DATA', data)

    const { status, error } = await createBank(formData);
    
    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('Admin.BanksactionMessages.createBankSuccess'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      // router.push('/');
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('Admin.Bankserrors.general.title'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleMenuOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new bank account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
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
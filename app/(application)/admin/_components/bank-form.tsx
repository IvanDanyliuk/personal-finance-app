'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { bankSchema, BankSchema } from '@/lib/types/form-schemas/admin';
import { TextField } from '@/components/inputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';


export const BankForm = () => {
  const t = useTranslations();
  const { toast } = useToast();

  const [isOpen, setOpen] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      name: '',
      country: '',
      logo: '',
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
            description: t('actionMessages.signUpSuccess'),
            variant: 'default',
            className: 'bg-success-1 text-success-2'
          });
          router.push('/');
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
                label={t('Name')}
                field={field}
                error={errors['name']?.message}
              />
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
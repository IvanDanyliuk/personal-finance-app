'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SelectField, TextField } from '@/components/inputs';
import { ACCOUNT_TYPES, COUNTRIES, CURRENCIES, PAYMENT_SYSTEMS } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { BankAccountSchema, bankAccountSchema } from '@/lib/types/form-schemas/bank-account';
import { SubmitButton } from '@/components/common';
import { TextAreaField } from '@/components/inputs/text-area-field';
import { createBankAccount } from '@/lib/actions/account.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { useToast } from '@/hooks/use-toast';
import { AccountType } from '@/lib/types/bank';


interface IAccountForm {
  banks: {
    value: string;
    label: string;
  }[];
};


export const AccountForm: React.FC<IAccountForm> = ({ banks }) => {
  const t = useTranslations();
  const { toast } = useToast();

  const [isOpen, setOpen] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      type: AccountType.BankAccount,
      country: '',
      bankId: '',
      accountNumber: '',
      paymentSystem: '',
      cardNumber: undefined,
      balance: 0,
      currency: '',
      additionalInfo: '',
    }
  });

  const watchedType = watch('type');
  const watchedCountry = watch('country');

  const handleMenuOpen = () => {
    if(isOpen) {
      reset();
    }
    setOpen(!isOpen)
  };

  const handleAccountTypeChange = () => {
    if(watchedType === AccountType.BankAccount && watchedCountry) {
      reset({ country: '', bankId: '' });
    }
  };

  const onFormSubmit: SubmitHandler<BankAccountSchema> = async (data) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('country', data.country!);
    formData.append('bankId', data.bankId!);
    formData.append('accountNumber', data.accountNumber!);
    formData.append('cardNumber', data.cardNumber ? data.cardNumber.toString() : '');
    formData.append('paymentSystem', data.paymentSystem!);
    formData.append('balance', data.balance.toString());
    formData.append('currency', data.currency);
    formData.append('additionalInfo', data.additionalInfo);

    const { status, error } = await createBankAccount(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t('HomePage.actionMessages.createBankAccountSuccess'),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      reset();
      setOpen(false);
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('HomePage.errors.createBankAccount.createBankAccountFailed'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleMenuOpen}>
      <DialogTrigger className='w-36 h-12 bg-primary-7 hover:bg-primary-6 rounded-full text-white text-sm md:text-base font-semibold'>
        {t('HomePage.createAccountForm.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent className='min-w-fit max-w-[calc(100%-30px)] md:max-w-fit max-h-[calc(100vh-30px)] overflow-y-scroll md:overflow-y-auto rounded-xl'>
        <DialogHeader>
          <DialogTitle>
            {t('HomePage.createAccountForm.title')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className='w-full flex flex-col md:flex-row md:flex-wrap gap-3'>
          <fieldset className='flex-1 space-y-3'>
            <Controller 
              name='type'
              control={control}
              render={({ field }) => (
                <SelectField 
                  name='type' 
                  label={t('HomePage.createAccountForm.typeFieldLabel')} 
                  options={ACCOUNT_TYPES} 
                  field={field} 
                  onHandleChange={handleAccountTypeChange}
                  variant='vertical'
                  placeholder={t('HomePage.createAccountForm.typeFieldPlaceholder')}
                  error={errors['type']?.message}
                />
              )}
            />
            <Controller 
              name='country'
              control={control}
              render={({ field }) => (
                <SelectField 
                  name='country'
                  label={t('HomePage.createAccountForm.countryFieldLabel')}
                  options={COUNTRIES}
                  field={field}
                  variant='vertical'
                  placeholder={t('HomePage.createAccountForm.countryFieldPlaceholder')}
                  disabled={watchedType === AccountType.Jug}
                  error={errors['country']?.message}
                />
              )}
            />
            <Controller 
              name='bankId'
              control={control}
              render={({ field }) => (
                <SelectField 
                  name='bankId'
                  label={t('HomePage.createAccountForm.bankFieldLabel')}
                  options={banks}
                  field={field}
                  variant='vertical'
                  placeholder={t('HomePage.createAccountForm.bankFieldPlaceholder')}
                  isLocalesActive={false}
                  disabled={watchedType === AccountType.Jug || !watchedCountry}
                  error={errors['bankId']?.message}
                />
              )}
            />
            <Controller 
              name='accountNumber'
              control={control}
              render={({ field }) => (
                <TextField 
                  name='accountNumber'
                  label={t('HomePage.createAccountForm.accountNumberFieldLabel')}
                  placeholder={t('HomePage.createAccountForm.accountNumberFieldPlaceholder')}
                  field={field}
                  disabled={watchedType === AccountType.Jug || !watchedCountry}
                  error={errors['accountNumber']?.message}
                />
              )}
            />
            <Controller 
              name='cardNumber'
              control={control}
              render={({ field }) => (
                <TextField 
                  name='cardNumber'
                  label={t('HomePage.createAccountForm.cardNumberFieldLabel')}
                  type='number'
                  placeholder={t('HomePage.createAccountForm.cardNumberFieldPlaceholder')}
                  field={field}
                  disabled={watchedType === AccountType.Jug || !watchedCountry}
                  error={errors['cardNumber']?.message}
                />
              )}
            />
          </fieldset>
          <fieldset className='flex-1 space-y-3'>
            <Controller 
              name='paymentSystem'
              control={control}
              render={({ field }) => (
                <SelectField 
                  name='paymentSystem'
                  label={t('HomePage.createAccountForm.paymentSystemFieldLabel')}
                  options={PAYMENT_SYSTEMS}
                  field={field}
                  variant='vertical'
                  placeholder={t('HomePage.createAccountForm.paymentSystemFieldPlaceholder')}
                  isLocalesActive
                  disabled={watchedType === AccountType.Jug || !watchedCountry}
                  error={errors['paymentSystem']?.message}
                />
              )}
            />
            <Controller 
              name='balance'
              control={control}
              render={({ field }) => (
                <TextField 
                  name='balance'
                  type='number'
                  label={t('HomePage.createAccountForm.balanceFieldLabel')}
                  field={field}
                  error={errors['balance']?.message}
                />
              )}
            />
            <Controller 
              name='currency'
              control={control}
              render={({ field }) => (
                <SelectField 
                  name='currency'
                  label={t('HomePage.createAccountForm.currencyFieldLabel')}
                  placeholder={t('HomePage.createAccountForm.currencyFieldPlaceholder')}
                  options={CURRENCIES}
                  field={field}
                  variant='vertical'
                  error={errors['currency']?.message}
                />
              )}
            />
            <Controller 
              name='additionalInfo'
              control={control}
              render={({ field }) => (
                <TextAreaField 
                  name='additionalInfo'
                  label={t('HomePage.createAccountForm.additionalInfo')}
                  field={field}
                  rows={6}
                />
              )}
            />
          </fieldset>
          <SubmitButton isSubmitting={isSubmitting} className='min-w-full'>
            {t('HomePage.createAccountForm.submitBtnLabel')}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};
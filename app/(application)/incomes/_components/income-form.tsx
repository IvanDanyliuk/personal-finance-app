'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/common';
import { DatePicker, SelectField, TextField } from '@/components/inputs';
import { TextAreaField } from '@/components/inputs/text-area-field';
import { Label } from '@/components/ui/label';
import { CURRENCIES, INCOME_SOURCES } from '@/lib/constants';
import { incomeSchema, IncomeSchema } from '@/lib/types/form-schemas/incomes';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';
import { useEffect, useState } from 'react';


interface IIncomeData extends IncomeSchema {
  id: string;
};

interface IIncomeForm {
  incomeToUpdate?: IIncomeData;
  action: SubmitHandler<IIncomeData>;
};


export const IncomeForm: React.FC<IIncomeForm> = ({ incomeToUpdate, action }) => {
  const session = useSession();
  const t = useTranslations('');

  const [accounts, setAccounts] = useState<{value: string; label: string}[]>([]);
  const bankAccounts = useBankAccountsStore(state => state.accounts);

  const defaultValues = incomeToUpdate || {
    userId: session.data!.user!.id!,
    date: new Date(), 
    amount: 0, 
    currency: '',
    bankAccountId: '',
    source: '', 
    comment: ''
  };

  const form = useForm<IIncomeData>({
    resolver: zodResolver(incomeSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const watchedCurrency = watch('currency');
  const watchedBankAccountId = watch('bankAccountId');

  const handleCurrencyChange = () => {
    if(watchedBankAccountId) {
      reset({ bankAccountId: '' });
    }
  };

  useEffect(() => {
    const bankAccountsOfSelectedCurrency = bankAccounts.filter(account => account.currency === watchedCurrency);
    const bankAccountOptions = bankAccountsOfSelectedCurrency
      .map(item => ({ 
        value: item.id, 
        label: `${t(`General.accountTypes.${item.type}`)} ${item.currency.toUpperCase()}${item.balance}` 
      }))
    setAccounts(bankAccountOptions);
  }, [watchedCurrency, bankAccounts]);

  return (
    <form onSubmit={handleSubmit(action)} className='flex flex-col gap-3'>
      <div className='flex flex-col justify-between items-center gap-1'>
        <Label htmlFor='date' className='w-full text-sm font-semibold'>
          {t('IncomesPage.createIncomeForm.dateFieldLabel')}
        </Label>
        <Controller 
          name='date'
          control={control}
          defaultValue={new Date()}
          render={({ field }) => (
            <DatePicker 
              mode='single'
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
              className='z-[1000]'
            />
          )}
        />
      </div>
      <Controller 
        name='amount'
        control={control}
        render={({ field }) => (
          <TextField 
            name='amount'
            label={t('IncomesPage.createIncomeForm.amountFieldLabel')}
            type='number'
            field={field}
            error={errors['amount']?.message}
          />
        )}
      />
      <Controller 
        name='source'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='source'
            label={t('IncomesPage.createIncomeForm.sourceFieldLabel')}
            variant='vertical'
            field={field}
            placeholder={t('IncomesPage.createIncomeForm.sourcePlaceholder')}
            options={INCOME_SOURCES}
            error={errors['source']?.message}
          />
        )}
      />
      <Controller 
        name='currency'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='currency'
            label={t('IncomesPage.createIncomeForm.currencyFieldLabel')}
            variant='vertical'
            field={field}
            placeholder={t('IncomesPage.createIncomeForm.currencyPlaceholder')}
            options={CURRENCIES}
            onHandleChange={handleCurrencyChange}
            error={errors['currency']?.message}
          />
        )}
      />
      <Controller 
        name='bankAccountId'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='bankAccountId'
            label={t('IncomesPage.createIncomeForm.bankAccountFieldLabel')}
            placeholder={t('IncomesPage.createIncomeForm.bankAccountPlaceholder')}
            variant='vertical'
            field={field}
            disabled={!watchedCurrency}
            options={accounts}
            isLocalesActive={false}
            error={errors['bankAccountId']?.message}
          />
        )}
      />
      <Controller 
        name='comment'
        control={control}
        render={({ field }) => (
          <TextAreaField 
            name='comment'
            label={t('IncomesPage.createIncomeForm.commentFieldLabel')}
            field={field}
            error={errors['comment']?.message}
          />
        )}
      />
      <SubmitButton isSubmitting={isSubmitting}>
        {t('IncomesPage.createIncomeForm.submitBtnLabel')}
      </SubmitButton>
    </form>
  );
};
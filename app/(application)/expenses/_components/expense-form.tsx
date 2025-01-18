'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { DatePicker, SelectField, TextField } from '@/components/inputs';
import { TextAreaField } from '@/components/inputs/text-area-field';
import { SubmitButton } from '@/components/common';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';
import { CURRENCIES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { expenseSchema, ExpenseSchema } from '@/lib/types/form-schemas/expenses';


interface IExpenseData extends ExpenseSchema {
  id: string;
}

interface IExpenseForm {
  expenseToUpdate?: IExpenseData;
  action: SubmitHandler<IExpenseData>;
};


export const ExpenseForm: React.FC<IExpenseForm> = ({ expenseToUpdate, action }) => {
  const session = useSession();
  const t = useTranslations('');

  const [accounts, setAccounts] = useState<{value: string; label: string}[]>([]);
  const bankAccounts = useBankAccountsStore(state => state.accounts);

  const defaultValues = expenseToUpdate || {
    userId: session.data!.user!.id!,
    date: new Date(), 
    amount: 0, 
    currency: '',
    category: '',
    destination: '', 
    paymentMethod: '', 
    bankAccountId: '',
    comment: ''
  };

  const form = useForm<IExpenseData>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, 
    reset
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
          {t('ExpensesPage.createExpenseForm.dateFieldLabel')}
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
            label={t('ExpensesPage.createExpenseForm.amountFieldLabel')}
            type='number'
            field={field}
            error={errors['amount']?.message}
          />
        )}
      />
      <Controller 
        name='destination'
        control={control}
        render={({ field }) => (
          <TextField 
            name='destination'
            label={t('ExpensesPage.createExpenseForm.destinationFieldLabel')}
            field={field}
            error={errors['destination']?.message}
          />
        )}
      />
      <Controller 
        name='category'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='category'
            label={t('ExpensesPage.createExpenseForm.categoryFieldLabel')}
            variant='vertical'
            field={field}
            placeholder={t('ExpensesPage.createExpenseForm.categoryPlaceholder')}
            options={EXPENSE_CATEGORIES}
            error={errors['category']?.message}
          />
        )}
      />
      {/* <Controller 
        name='paymentMethod'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='paymentMethod'
            label={t('ExpensesPage.createExpenseForm.paymentMethodFieldLabel')}
            variant='vertical'
            field={field}
            placeholder={t('ExpensesPage.createExpenseForm.paymentMethodPlaceholder')}
            options={PAYMENT_METHODS}
            error={errors['paymentMethod']?.message}
          />
        )}
      /> */}
      <Controller 
        name='currency'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='currency'
            label={t('ExpensesPage.createExpenseForm.currencyFieldLabel')}
            variant='vertical'
            field={field}
            onHandleChange={handleCurrencyChange}
            placeholder={t('ExpensesPage.createExpenseForm.currencyPlaceholder')}
            options={CURRENCIES}
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
            label={t('ExpensesPage.createExpenseForm.commentFieldLabel')}
            field={field}
            error={errors['comment']?.message}
          />
        )}
      />
      <SubmitButton isSubmitting={isSubmitting}>
        {t('ExpensesPage.createExpenseForm.submitBtnLabel')}
      </SubmitButton>
    </form>
  );
};
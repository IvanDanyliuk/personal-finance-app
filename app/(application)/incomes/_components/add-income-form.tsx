'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SubmitButton } from '@/components/common';
import { DatePicker, SelectField, TextField } from '@/components/inputs';
import { TextAreaField } from '@/components/inputs/text-area-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createIncome } from '@/lib/actions/income.actions';
import { CURRENCIES, INCOME_SOURCES } from '@/lib/constants';
import { ActionStatus } from '@/lib/types/common.types';
import { incomeSchema, IncomeSchema } from '@/lib/types/form-schemas/incomes';


export const AddIncomeForm: React.FC = () => {
  const t = useTranslations('');
  const { toast } = useToast();
  const session = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<IncomeSchema>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { 
      userId: session.data!.user!.id!, 
      date: new Date(), 
      amount: 0, 
      currency: '',
      source: '', 
      comment: ''
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<IncomeSchema> = async (data) => {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('date', data.date.toISOString());
    formData.append('amount', data.amount.toString() || '0');
    formData.append('currency', data.currency);
    formData.append('source', data.source);
    formData.append('comment', data.comment);
    
    const { status, error } = await createIncome(formData);

    if(status === ActionStatus.Success) {
      toast({
        description: t(('IncomesPage.actionMessages.createIncomeSuccess')),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <DialogTrigger className='w-36 h-12 bg-primary-7 hover:bg-primary-6 rounded-full text-white text-sm md:text-base font-semibold'>
        {t('IncomesPage.createIncomeForm.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('IncomesPage.createIncomeForm.title')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className='flex flex-col gap-3'>
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
                error={errors['currency']?.message}
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
      </DialogContent>
    </Dialog>
  );
};
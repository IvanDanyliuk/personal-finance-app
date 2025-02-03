'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SelectField, TextField } from '@/components/inputs';
import { SubmitButton } from '@/components/common';
import { Button } from '@/components/ui/button';
import { transferFunds } from '@/lib/actions/account.actions';
import { IBankAccount } from '@/lib/types/bank';
import { ActionStatus } from '@/lib/types/common.types';
import { TransferFundsSchema, transferFundsSchema } from '@/lib/types/form-schemas/transfer-funds';


interface ITransferFundsDialog {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bankAccounts: IBankAccount[];
  currentAccountId?: string;
  currency?: string;
};


export const TransferFundsDialog: React.FC<ITransferFundsDialog> = ({ 
  open, 
  onOpenChange, 
  bankAccounts,
  currentAccountId,
  currency
}) => {
  const t = useTranslations();
  const session = useSession();
  const { toast } = useToast();

  const options = bankAccounts
    .filter(item => item.currency === currency && item.id !== currentAccountId)
    .map(item => ({
      value: item.id,
      label: `${item.accountNumber || ''} ${item.currency.toUpperCase()}${item.balance}`,
      icon: item.bank ? item.bank.logo : undefined,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TransferFundsSchema>({
    resolver: zodResolver(transferFundsSchema),
    defaultValues: {
      userId: '',
      accountFromId: currentAccountId,
      accountToId: '',
      amount: 0,
      currency,
    },
  });

  const onFormSubmit: SubmitHandler<TransferFundsSchema> = async (data) => {
    const formData = new FormData();
    formData.append('userId', session.data!.user!.id!);
    formData.append('accountFromId', data.accountFromId);
    formData.append('accountToId', data.accountToId);
    formData.append('amount', data.amount.toString());
    formData.append('currency', data.currency);

    const { status, error } = await transferFunds(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t(('HomePage.actionMessages.transferFundSuccess')),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('HomePage.errors.general'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-fit md:min-w-[32rem] max-w-[calc(100%-3rem)] md:max-w-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl'>
        <h2 className='text-lg font-semibold'>
          {t('HomePage.balanceSection.transferFundsForm.title')}
        </h2>
        <form 
          onSubmit={handleSubmit(onFormSubmit)} 
          className='space-y-3'
        >
          <Controller 
            name='accountToId'
            control={control}
            render={({ field }) => (
              <SelectField 
                name='accountToId' 
                label={t('HomePage.balanceSection.transferFundsForm.accountToIdFieldLabel')}
                field={field} 
                options={options} 
                disabled={isSubmitting}
                variant='vertical'
                error={errors['accountToId']?.message}
              />
            )}
          />
          <Controller 
            name='amount'
            control={control}
            render={({ field }) => (
              <TextField 
                name='amount'
                label={t('HomePage.balanceSection.transferFundsForm.amountFieldLabel')}
                type='number'
                field={field}
                error={errors['amount']?.message}
              />
            )}
          />
          <div className='w-full flex items-center gap-3'>
            <SubmitButton isSubmitting={isSubmitting} className='flex-1'>
              {t('HomePage.balanceSection.transferFundsForm.submitBtnLabel')}
            </SubmitButton>
            <Button 
              type='button' 
              onClick={() => onOpenChange(false)} 
              className='mt-3 py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
            >
              {t('HomePage.balanceSection.transferFundsForm.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
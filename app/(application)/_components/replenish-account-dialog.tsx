'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/common';
import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { replenishAccount } from '@/lib/actions/account.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { replenishAccountSchema, ReplenishAccountSchema } from '@/lib/types/form-schemas/transfer-funds';


interface IReplenishAccountDialog {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentAccountId?: string;
};


export const ReplenishAccountDialog: React.FC<IReplenishAccountDialog> = ({ 
  open, 
  onOpenChange, 
  currentAccountId
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const session = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ReplenishAccountSchema>({
    resolver: zodResolver(replenishAccountSchema),
    defaultValues: {
      userId: '',
      accountId: currentAccountId,
      amount: 0,
    },
  });

  const onFormSubmit: SubmitHandler<ReplenishAccountSchema> = async (data) => {
    const formData = new FormData();
    formData.append('userId', session.data!.user!.id!);
    formData.append('accountId', data.accountId);
    formData.append('amount', data.amount.toString());

    const { status, error } = await replenishAccount(formData);

    if(status === ActionStatus.Success && !error) {
      toast({
        description: t(('HomePage.actionMessages.accountReplenishmentSuccess')),
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
      <DialogContent>
        <h2 className='text-lg font-semibold'>
          {t('HomePage.balanceSection.replenishAccountForm.title')}
        </h2>
        <form 
          onSubmit={handleSubmit(onFormSubmit)} 
          className='space-y-3'
        >
          <Controller 
            name='amount'
            control={control}
            render={({ field }) => (
              <TextField 
                name='amount'
                label={t('HomePage.balanceSection.replenishAccountForm.amountFieldLabel')}
                type='number'
                field={field}
                error={errors['amount']?.message}
              />
            )}
          />
          <div className='w-full flex items-center gap-3'>
            <SubmitButton isSubmitting={isSubmitting} className='flex-1'>
              {t('HomePage.balanceSection.replenishAccountForm.submitBtnLabel')}
            </SubmitButton>
            <Button 
              type='button' 
              onClick={() => onOpenChange(false)} 
              className='mt-3 py-6 flex-1 rounded-full bg-secondary-2 hover:bg-secondary-1 text-white font-semibold'
            >
              {t('HomePage.balanceSection.replenishAccountForm.cancelBtnLabel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
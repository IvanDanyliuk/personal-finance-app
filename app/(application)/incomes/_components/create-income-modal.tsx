'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createIncome } from '@/lib/actions/income.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { IncomeForm } from './';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';


interface ICreateIncomeModal {
  funds: any[];
}


export const CreateIncomeModal: React.FC<ICreateIncomeModal> = ({ funds }) => {
  const t = useTranslations('');
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<IncomeSchema> = async (data) => {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('date', data.date.toISOString());
    formData.append('amount', data.amount.toString() || '0');
    formData.append('currency', data.currency);
    formData.append('bankAccountId', data.bankAccountId);
    formData.append('source', data.source);
    formData.append('comment', data.comment || '');
    
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

  const setBankAccounts = useBankAccountsStore(state => state.setBankAccounts);

  useEffect(() => {
    setBankAccounts(funds);
  }, [funds, setBankAccounts]);

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
        <IncomeForm action={onSubmitForm} />
      </DialogContent>
    </Dialog>
  );
};
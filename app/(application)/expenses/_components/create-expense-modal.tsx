'use client';

import { useState } from 'react';
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
import { createExpense } from '@/lib/actions/expense.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { ExpenseSchema } from '@/lib/types/form-schemas/expenses';
import { ExpenseForm } from './';


export const CreateExpenseModal: React.FC = () => {
  const t = useTranslations('');
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<ExpenseSchema> = async (data) => {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('date', data.date.toISOString());
    formData.append('amount', data.amount.toString() || '0');
    formData.append('currency', data.currency);
    formData.append('category', data.category);
    formData.append('destination', data.destination);
    formData.append('paymentMethod', data.paymentMethod);
    formData.append('comment', data.comment || '');
    
    const { status, error } = await createExpense(formData);

    if(status === ActionStatus.Success) {
      toast({
        description: t(('ExpensesPage.actionMessages.createExpenseSuccess')),
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
        {t('ExpensesPage.createExpenseForm.triggerBtnLabel')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('ExpensesPage.createExpenseForm.title')}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm action={onSubmitForm} />
      </DialogContent>
    </Dialog>
  );
};
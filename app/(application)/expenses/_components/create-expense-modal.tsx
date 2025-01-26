'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { createExpense } from '@/lib/actions/expense.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { ExpenseSchema } from '@/lib/types/form-schemas/expenses';
import { ExpenseForm } from './';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';


interface ICreateExpenseModal {
  funds: any[];
};


export const CreateExpenseModal: React.FC<ICreateExpenseModal> = ({ funds }) => {
  const t = useTranslations('');
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFormOpen = () => setIsOpen(!isOpen);

  const onSubmitForm: SubmitHandler<ExpenseSchema> = async (data) => {
    const selectedAccount = funds.find(item => item.id === data.bankAccountId);

    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('date', data.date.toISOString());
    formData.append('amount', data.amount.toString() || '0');
    formData.append('currency', data.currency);
    formData.append('category', data.category);
    formData.append('destination', data.destination);
    formData.append('paymentMethod', selectedAccount.type);
    formData.append('bankAccountId', data.bankAccountId);
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

  const setBankAccounts = useBankAccountsStore(state => state.setBankAccounts);

  useEffect(() => {
    setBankAccounts(funds);
  }, [funds, setBankAccounts]);

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='w-12 md:w-36 h-12 flex justify-center items-center gap-1 bg-primary-7 hover:bg-primary-6 rounded-full text-white text-sm md:text-base font-semibold'>
              <Plus className='md:-ml-2' />
              <span className='hidden md:inline'>
                {t('ExpensesPage.createExpenseForm.triggerBtnLabel')}
              </span>
            </TooltipTrigger>
            <TooltipContent className='max-w-44 text-center bg-primary-2 text-secondary-8 rounded-xl'>
              <p>
                {t('ExpensesPage.createExpenseForm.triggerBtnTooltip')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
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
import { createIncome } from '@/lib/actions/income.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { IncomeForm } from './';
import useBankAccountsStore from '@/lib/store/bank-accounts-slice';


interface ICreateIncomeModal {
  funds: any[];
};


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
        title: t('ExpensesPage.errors.general'),
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
                {t('IncomesPage.createIncomeForm.triggerBtnLabel')}
              </span>
            </TooltipTrigger>
            <TooltipContent className='max-w-44 text-center bg-primary-2 text-secondary-8 rounded-xl'>
              <p>
                {t('IncomesPage.createIncomeForm.triggerBtnTooltip')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className='min-w-fit max-w-[calc(100%-3rem)] md:max-w-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl'>
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
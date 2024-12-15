'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActionStatus } from '@/lib/types/common.types';
import { IncomeSchema } from '@/lib/types/form-schemas/incomes';
import { TableRowActionsMenu } from '@/components/common';
import { deleteIncome, updateIncome } from '@/lib/actions/income.actions';


interface IncomesData extends IncomeSchema {
  id: string;
};

interface IIncomesTable {
  status: ActionStatus;
  data: IncomesData[];
  count: number;
  error: string | null;
};


export const IncomesTable: React.FC<IIncomesTable> = ({ status, data, count, error }) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const page = searchParams.get('page');
    if(!page) {
      params.set('page', '1');
      replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  return (
    <div>
      <Table className='border-separate border-spacing-y-3'>
        <TableHeader>
          <TableRow className='text-foreground border-none'>
            <TableHead className='w-[100px] px-6 py-5 bg-background-secondary rounded-l-full'>
              {t('IncomesPage.incomesTable.dateColLabel').toUpperCase()}
            </TableHead>
            <TableHead className='px-6 py-4 bg-background-secondary'>
              {t('IncomesPage.incomesTable.amountColLabel').toUpperCase()}
            </TableHead>
            <TableHead className='px-6 py-4 bg-background-secondary'>
              {t('IncomesPage.incomesTable.currencyColLabel').toUpperCase()}
            </TableHead>
            <TableHead className='px-6 py-4 bg-background-secondary'>
              {t('IncomesPage.incomesTable.sourceColLabel').toUpperCase()}
            </TableHead>
            <TableHead className='px-6 py-4 bg-background-secondary'>
              {t('IncomesPage.incomesTable.commentColLabel').toUpperCase()}
            </TableHead>
            <TableHead className='px-6 py-4 bg-background-secondary rounded-r-full'>

            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(incomeItem => (
            <TableRow key={crypto.randomUUID()} className='text-foreground bg-background-neutral hover:bg-background-secondary border-none'>
              <TableCell className='px-6 py-3 rounded-l-full'>
                {format(incomeItem.date, 'dd.MM.yyyy')}
              </TableCell>
              <TableCell className='px-6 py-3'>
                {incomeItem.amount}
              </TableCell>
              <TableCell className='px-6 py-3'>
                {t(`General.currencies.${incomeItem.currency}`)}
              </TableCell>
              <TableCell className='px-6 py-3'>
                {t(`IncomesPage.income_sources.${incomeItem.source}`)}
              </TableCell>
              <TableCell className='px-6 py-3'>
                {incomeItem.comment || ''}
              </TableCell>
              <TableCell className='px-6 py-3 rounded-r-full'>
                <TableRowActionsMenu 
                  actionId={incomeItem.id}
                  updateBtnLabel='Update'
                  deleteBtnLabel='Delete'
                  confirmDeleteTitle='Are you sure you want to delete this income item?'
                  confirmDeleteMessage='It will be impossible to undo this action.'
                  updateAction={updateIncome}
                  deleteAction={deleteIncome}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
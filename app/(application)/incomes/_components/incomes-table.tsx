'use client';

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
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';


interface IIncomesTable {
  status: ActionStatus;
  data: IncomeSchema[];
  error: string | null;
};


export const IncomesTable: React.FC<IIncomesTable> = ({ data }) => {
  const t = useTranslations();

  return (
    <div>
      <Table className='border-separate border-spacing-y-3'>
        <TableHeader>
          <TableRow className='text-foreground border-none'>
            <TableHead className='w-[100px] px-6 py-4 bg-background-secondary rounded-l-full'>
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
            <TableRow key={crypto.randomUUID()} className='text-foreground border-none'>
              <TableCell className='px-6 py-3 bg-background-neutral rounded-l-full'>
                {format(incomeItem.date, 'dd.MM.yyyy')}
              </TableCell>
              <TableCell className='px-6 py-3 bg-background-neutral'>
                {incomeItem.amount}
              </TableCell>
              <TableCell className='px-6 py-3 bg-background-neutral'>
                {t(`General.currencies.${incomeItem.currency}`)}
              </TableCell>
              <TableCell className='px-6 py-3 bg-background-neutral'>
                {t(`IncomesPage.income_sources.${incomeItem.source}`)}
              </TableCell>
              <TableCell className='px-6 py-3 bg-background-neutral'>
                {incomeItem.comment || ''}
              </TableCell>
              <TableCell className='px-6 py-3 bg-background-neutral rounded-r-full'>
                Actions
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
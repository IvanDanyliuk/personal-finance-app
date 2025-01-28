'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';


interface ILatestActivity {
  data: {
    latestTransactions: any[];
    topIncome?: any;
    topExpense?: any;
  };
};


export const LatestActivity: React.FC<ILatestActivity> = ({ data }) => {
  const { latestTransactions, topIncome, topExpense } = data;

  const t = useTranslations();

  return (
    <div className='relative w-fit px-3 flex flex-col md:flex-row items-center gap-6'>
      <div className='flex-1'>
        <h2 className='mb-3 text-base text-center font-semibold'>
          {t('AnalyticsPage.latestActivity.latestActivityTable.title')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow className='text-sm border-none'>
              <TableHead className='px-5 bg-background-normal rounded-l-full'>
                {t('AnalyticsPage.latestActivity.latestActivityTable.dateColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.latestActivity.latestActivityTable.amountColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.latestActivity.latestActivityTable.currencyColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal'>
                {t('AnalyticsPage.latestActivity.latestActivityTable.categoryColLabel')}
              </TableHead>
              <TableHead className='px-5 bg-background-normal rounded-r-full'>
                {t('AnalyticsPage.latestActivity.latestActivityTable.accountColLabel')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestTransactions.map((transaction, ) => (
              <TableRow key={crypto.randomUUID()} className='text-xs'>
                <TableCell className='px-5 font-medium'>
                  {format(transaction.date, 'dd.MM.yyyy')}
                </TableCell>
                <TableCell className={cn(
                  transaction.category 
                    ? 'text-danger-2' 
                    : transaction.source 
                      ? 'text-success-2' 
                      : '', 
                  'px-5 font-semibold'
                )}>
                  {transaction.category 
                    ? `-${transaction.amount}` 
                    : transaction.source 
                      ? `+${transaction.amount}` 
                      : transaction.amount
                  }
                </TableCell>
                <TableCell className='px-5'>
                  {t(`General.currencies.${transaction.currency}`)}
                </TableCell>
                <TableCell className='px-5'>
                  {transaction.category 
                    ? t(`ExpensesPage.expense_destinations.${transaction.category}`) 
                    : transaction.source 
                      ? t(`IncomesPage.income_sources.${transaction.source}`) 
                      : '-'
                  }
                </TableCell>
                <TableCell className='px-5'>
                  {transaction.bankAccount.accountNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        {topIncome && (
          <div className='flex items-center gap-3 font-semibold'>
            <h3 className='text-lg text-primary-7'>
              {t('AnalyticsPage.latestActivity.topIncome')}
            </h3>
            <p>
              {`${topIncome.currency.toUpperCase()} ${topIncome.amount}`}
            </p>
          </div>
        )}
        {topExpense && (
          <div className='flex items-center gap-3 font-semibold'>
            <h3 className='text-lg text-primary-7'>
              {t('AnalyticsPage.latestActivity.topExpense')}
            </h3>
            <p>
              {`${topExpense.currency.toUpperCase()} ${topExpense.amount}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};